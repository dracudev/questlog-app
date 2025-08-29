import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, Game } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameResponseDto } from './dto/game-response.dto';
import { GameDetailDto } from './dto/game-detail.dto';
import { GameFiltersDto } from './dto/game-filters.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedGamesResponseDto } from './dto/paginated-game.dto';
import { GamesQueryDto } from './dto/games-query.dto';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto): Promise<GameResponseDto> {
    const { genreIds, platformIds, ...gameData } = createGameDto;

    const slug = this.generateSlug(gameData.title);

    try {
      const game = await this.prisma.game.create({
        data: {
          ...gameData,
          slug,
          genres: genreIds?.length
            ? {
                create: genreIds.map((genreId) => ({ genreId })),
              }
            : undefined,
          platforms: platformIds?.length
            ? {
                create: platformIds.map((platformId) => ({ platformId })),
              }
            : undefined,
        },
        include: {
          developer: true,
          publisher: true,
          genres: {
            include: {
              genre: true,
            },
          },
          platforms: {
            include: {
              platform: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });

      return this.toGameResponseDto(game);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Game with this title or slug already exists');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid developer, publisher, genre, or platform ID');
        }
      }
      throw error;
    }
  }

  async findAll(query: GamesQueryDto): Promise<PaginatedGamesResponseDto> {
    const {
      page = 1,
      limit = 12,
      search,
      genreIds,
      platformIds,
      developerId,
      publisherId,
      status,
      minRating,
      maxRating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.GameWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                {
                  developer: {
                    name: { contains: search, mode: 'insensitive' },
                  },
                },
              ],
            }
          : {},
        genreIds?.length
          ? {
              genres: {
                some: {
                  genreId: { in: genreIds },
                },
              },
            }
          : {},
        platformIds?.length
          ? {
              platforms: {
                some: {
                  platformId: { in: platformIds },
                },
              },
            }
          : {},
        developerId ? { developerId } : {},
        publisherId ? { publisherId } : {},
        status ? { status } : {},
        minRating ? { averageRating: { gte: minRating } } : {},
        maxRating ? { averageRating: { lte: maxRating } } : {},
      ],
    };

    // Build orderBy clause
    const orderBy: Prisma.GameOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'title':
        orderBy.title = sortOrder;
        break;
      case 'releaseDate':
        orderBy.releaseDate = sortOrder;
        break;
      case 'averageRating':
        orderBy.averageRating = sortOrder;
        break;
      case 'reviewCount':
        orderBy.reviewCount = sortOrder;
        break;
      default:
        orderBy.createdAt = sortOrder;
    }

    const [games, total] = await Promise.all([
      this.prisma.game.findMany({
        where,
        skip,
        take: limit,
        include: {
          developer: true,
          publisher: true,
          genres: {
            include: {
              genre: true,
            },
          },
          platforms: {
            include: {
              platform: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy,
      }),
      this.prisma.game.count({ where }),
    ]);

    const items = games.map((game) => this.toGameResponseDto(game));

    return PaginatedGamesResponseDto.from(items, page, limit, total);
  }

  async findBySlug(slug: string): Promise<GameDetailDto> {
    const game = await this.prisma.game.findUnique({
      where: { slug },
      include: {
        developer: true,
        publisher: true,
        genres: {
          include: {
            genre: true,
          },
        },
        platforms: {
          include: {
            platform: true,
          },
        },
        reviews: {
          where: { isPublished: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return this.toGameDetailDto(game);
  }

  async findById(id: string): Promise<Game | null> {
    return this.prisma.game.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<GameResponseDto> {
    const existingGame = await this.findById(id);
    if (!existingGame) {
      throw new NotFoundException('Game not found');
    }

    const { genreIds, platformIds, ...gameData } = updateGameDto;

    // Generate new slug if title changed
    if (gameData.title && gameData.title !== existingGame.title) {
      gameData.slug = this.generateSlug(gameData.title);
    }

    try {
      const game = await this.prisma.$transaction(async (tx) => {
        const updatedGame = await tx.game.update({
          where: { id },
          data: gameData,
        });

        if (genreIds !== undefined) {
          await tx.gameGenre.deleteMany({ where: { gameId: id } });
          if (genreIds.length > 0) {
            await tx.gameGenre.createMany({
              data: genreIds.map((genreId) => ({ gameId: id, genreId })),
            });
          }
        }

        if (platformIds !== undefined) {
          await tx.gamePlatform.deleteMany({ where: { gameId: id } });
          if (platformIds.length > 0) {
            await tx.gamePlatform.createMany({
              data: platformIds.map((platformId) => ({
                gameId: id,
                platformId,
              })),
            });
          }
        }

        return tx.game.findUnique({
          where: { id },
          include: {
            developer: true,
            publisher: true,
            genres: {
              include: {
                genre: true,
              },
            },
            platforms: {
              include: {
                platform: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        });
      });

      return this.toGameResponseDto(game!);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Game with this title or slug already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const game = await this.findById(id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    await this.prisma.game.delete({
      where: { id },
    });
  }

  async updateRating(gameId: string): Promise<void> {
    const result = await this.prisma.review.aggregate({
      where: {
        gameId,
        isPublished: true,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await this.prisma.game.update({
      where: { id: gameId },
      data: {
        averageRating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });
  }

  async getSimilarGames(gameId: string, limit: number = 6): Promise<GameResponseDto[]> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        genres: true,
      },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const genreIds = game.genres.map((g) => g.genreId);

    const similarGames = await this.prisma.game.findMany({
      where: {
        AND: [
          { id: { not: gameId } },
          genreIds.length > 0
            ? {
                genres: {
                  some: {
                    genreId: { in: genreIds },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        developer: true,
        publisher: true,
        genres: {
          include: {
            genre: true,
          },
        },
        platforms: {
          include: {
            platform: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        averageRating: 'desc',
      },
      take: limit,
    });

    return similarGames.map((game) => this.toGameResponseDto(game));
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
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
          content: review.content.substring(0, 300) + (review.content.length > 300 ? '...' : ''),
          rating: review.rating,
          createdAt: review.createdAt,
          user: review.user,
          stats: {
            likesCount: review._count.likes,
            commentsCount: review._count.comments,
          },
        })) || [],
    };
  }
}
