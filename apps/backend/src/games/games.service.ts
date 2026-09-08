import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, Game } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { IgdbClientService } from '@/igdb/igdb-client.service';
import { toGameResponseDto as mapIgdbToDto, toGameDetailDto as mapIgdbToDetail } from '@/igdb/igdb.mapper';
import {
  CreateGameDto,
  UpdateGameDto,
  GameResponseDto,
  GameDetailDto,
  PaginatedGamesResponseDto,
  GamesQueryDto,
} from './dto';
import { GAMES_CONSTANTS } from './constants/games.constants';

@Injectable()
export class GamesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly igdb: IgdbClientService,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<GameResponseDto> {
    const { genreIds, platformIds, ...gameData } = createGameDto;
    const slug = this.generateSlug(gameData.title);
    try {
      const game = await this.prisma.game.create({
        data: {
          ...gameData,
          slug,
          genres: genreIds?.length ? { create: genreIds.map((genreId) => ({ genreId })) } : undefined,
          platforms: platformIds?.length ? { create: platformIds.map((platformId) => ({ platformId })) } : undefined,
        },
        include: {
          developer: true,
          publisher: true,
          genres: { include: { genre: true } },
          platforms: { include: { platform: true } },
          _count: { select: { reviews: true } },
        },
      });
      return this.toGameResponseDto(game);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new BadRequestException('Game with this title or slug already exists');
        if (error.code === 'P2003') throw new BadRequestException('Invalid developer, publisher, genre, or platform ID');
        if (error.code === 'P2025') throw new NotFoundException('Referenced entity not found');
      }
      throw error;
    }
  }

  // IGDB proxy: no DB persistence, just map IGDB -> frontend DTO
  async findAll(query: GamesQueryDto): Promise<PaginatedGamesResponseDto> {
    const {
      page = GAMES_CONSTANTS.PAGINATION.DEFAULT_PAGE,
      limit = GAMES_CONSTANTS.PAGINATION.DEFAULT_LIMIT,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const sanitizedSearch = search?.trim().replace(/[<>\"']/g, '');
    const offset = (page - 1) * limit;

    const [games, total] = await Promise.all([
      this.igdb.searchGames({
        search: sanitizedSearch,
        limit,
        offset,
        sortBy,
        sortOrder,
      }),
      this.igdb.countGames({ search: sanitizedSearch }),
    ]);

    let items = games.map(mapIgdbToDto);
    if (query.minRating !== undefined) {
      items = items.filter((g) => (g.game.averageRating || 0) >= query.minRating!);
    }
    if (query.maxRating !== undefined) {
      items = items.filter((g) => (g.game.averageRating || 0) <= query.maxRating!);
    }

    return PaginatedGamesResponseDto.from(items, page, limit, total);
  }

  async findBySlug(slug: string): Promise<GameDetailDto> {
    if (!slug) throw new BadRequestException('Slug is required');
    const igdbGame = await this.igdb.findBySlug(slug);
    if (!igdbGame) throw new NotFoundException('Game not found');

    let recentReviews: any[] = [];
    try {
      const localGame = await this.prisma.game.findFirst({ where: { igdbId: igdbGame.id } });
      if (localGame) {
        const reviews = await this.prisma.review.findMany({
          where: { gameId: localGame.id, isPublished: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, username: true, displayName: true, avatar: true } },
            _count: { select: { likes: true, comments: true } },
          },
        });
        recentReviews = reviews.map((r: any) => ({
          id: r.id,
          title: r.title,
          content: r.content.substring(0, GAMES_CONSTANTS.REVIEW_PREVIEW.MAX_LENGTH) + (r.content.length > GAMES_CONSTANTS.REVIEW_PREVIEW.MAX_LENGTH ? '...' : ''),
          rating: r.rating,
          createdAt: r.createdAt,
          user: r.user,
          stats: { likesCount: r._count.likes, commentsCount: r._count.comments },
        }));
      }
    } catch {
      // enrichment optional
    }

    const detail = mapIgdbToDetail(igdbGame);
    return { ...detail, recentReviews };
  }

  async findById(id: string): Promise<Game | null> {
    const numeric = Number(id);
    if (!Number.isNaN(numeric) && String(numeric) === id) {
      try {
        const igdbGame = await this.igdb.findById(numeric);
        if (igdbGame) {
          return {
            id: String(igdbGame.id),
            title: igdbGame.name,
            slug: igdbGame.slug,
            description: igdbGame.storyline || igdbGame.summary || null,
            summary: igdbGame.summary || null,
            releaseDate: igdbGame.first_release_date ? new Date(igdbGame.first_release_date * 1000) : null,
            status: 'RELEASED' as any,
            coverImage: igdbGame.cover?.image_id ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${igdbGame.cover.image_id}.jpg` : null,
            screenshots: [],
            videos: [],
            rawgId: null,
            igdbId: igdbGame.id,
            steamId: null,
            metacriticId: null,
            averageRating: igdbGame.total_rating ? igdbGame.total_rating / 10 : null,
            reviewCount: igdbGame.rating_count || 0,
            playCount: 0,
            developerId: null,
            publisherId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Game;
        }
      } catch {}
    }
    try {
      const byCuid = await this.prisma.game.findUnique({ where: { id } });
      if (byCuid) return byCuid;
      if (!Number.isNaN(numeric)) {
        return this.prisma.game.findFirst({ where: { igdbId: numeric } });
      }
      return null;
    } catch {
      return null;
    }
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<GameResponseDto> {
    const existingGame = await this.prisma.game.findUnique({ where: { id } });
    if (!existingGame) throw new NotFoundException('Game not found');
    const { genreIds, platformIds, ...gameData } = updateGameDto;
    if (gameData.title && gameData.title !== existingGame.title) {
      (gameData as any).slug = this.generateSlug(gameData.title);
    }
    try {
      const game = await this.prisma.$transaction(async (tx) => {
        const updatedGame = await tx.game.update({ where: { id }, data: gameData as any });
        if (genreIds !== undefined) {
          await tx.gameGenre.deleteMany({ where: { gameId: id } });
          if (genreIds.length > 0) await tx.gameGenre.createMany({ data: genreIds.map((genreId) => ({ gameId: id, genreId })) });
        }
        if (platformIds !== undefined) {
          await tx.gamePlatform.deleteMany({ where: { gameId: id } });
          if (platformIds.length > 0) await tx.gamePlatform.createMany({ data: platformIds.map((platformId) => ({ gameId: id, platformId })) });
        }
        return tx.game.findUnique({
          where: { id },
          include: {
            developer: true,
            publisher: true,
            genres: { include: { genre: true } },
            platforms: { include: { platform: true } },
            _count: { select: { reviews: true } },
          },
        });
      });
      return this.toGameResponseDto(game!);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Game with this title or slug already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    await this.prisma.game.delete({ where: { id } });
  }

  async updateRating(gameId: string): Promise<void> {
    try {
      const exists = await this.prisma.game.findUnique({ where: { id: gameId } });
      if (!exists) return;
      const result = await this.prisma.review.aggregate({
        where: { gameId, isPublished: true },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await this.prisma.game.update({
        where: { id: gameId },
        data: { averageRating: result._avg.rating || 0, reviewCount: result._count.rating },
      });
    } catch {}
  }

  async getSimilarGames(gameId: string, limit: number = GAMES_CONSTANTS.SIMILAR_GAMES.DEFAULT_LIMIT): Promise<GameResponseDto[]> {
    const numeric = Number(gameId);
    if (!Number.isNaN(numeric)) {
      const similar = await this.igdb.getSimilarGames(numeric, limit);
      return similar.map(mapIgdbToDto);
    }
    try {
      const bySlug = await this.igdb.findBySlug(gameId);
      if (bySlug) {
        const similar = await this.igdb.getSimilarGames(bySlug.id, limit);
        return similar.map(mapIgdbToDto);
      }
    } catch {}
    return [];
  }

  private generateSlug(title: string): string {
    if (!title || typeof title !== 'string') throw new BadRequestException('Title is required for slug generation');
    return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  private toGameResponseDto(game: any): GameResponseDto {
    return {
      game: {
        id: game.id,
        title: game.title,
        slug: game.slug,
        coverImage: game.coverImage,
        releaseDate: game.releaseDate,
        status: game.status,
        averageRating: game.averageRating,
        reviewCount: game._count?.reviews || game.reviewCount || 0,
      },
      description: game.description,
      summary: game.summary,
      screenshots: game.screenshots,
      videos: game.videos,
      playCount: game.playCount,
      developer: game.developer,
      publisher: game.publisher,
      genres: game.genres?.map((g: any) => g.genre) || [],
      platforms: game.platforms?.map((p: any) => p.platform) || [],
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
      rawgId: game.rawgId,
      igdbId: game.igdbId,
      steamId: game.steamId,
      metacriticId: game.metacriticId,
    };
  }

  private toGameDetailDto(game: any): GameDetailDto {
    return {
      ...this.toGameResponseDto(game),
      rawgId: game.rawgId,
      igdbId: game.igdbId,
      steamId: game.steamId,
      metacriticId: game.metacriticId,
      recentReviews:
        game.reviews?.map((review: any) => ({
          id: review.id,
          title: review.title,
          content: review.content.substring(0, GAMES_CONSTANTS.REVIEW_PREVIEW.MAX_LENGTH) + (review.content.length > GAMES_CONSTANTS.REVIEW_PREVIEW.MAX_LENGTH ? '...' : ''),
          rating: review.rating,
          createdAt: review.createdAt,
          user: review.user,
          stats: { likesCount: review._count.likes, commentsCount: review._count.comments },
        })) || [],
    };
  }
}
