import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { PaginatedGenresResponseDto } from './dto/paginated-genre.dto';

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto): Promise<GenreResponseDto> {
    const slug = this.generateSlug(createGenreDto.name);

    try {
      const genre = await this.prisma.genre.create({
        data: {
          ...createGenreDto,
          slug,
        },
        include: { games: { select: { gameId: true } } },
      });

      return {
        id: genre.id,
        name: genre.name,
        slug: genre.slug,
        description: genre.description,
        games: genre.games ? genre.games.map((g) => g.gameId) : [],
      } as GenreResponseDto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Genre with this name already exists');
        }
      }
      throw error;
    }
  }

  async findAll({
    page = 1,
    limit = 20,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedGenresResponseDto> {
    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.genre.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { games: { select: { gameId: true } } },
      }),
      this.prisma.genre.count({ where }),
    ]);

    const mapped = data.map(
      (g: any) =>
        ({
          id: g.id,
          name: g.name,
          slug: g.slug,
          description: g.description,
          games: g.games ? g.games.map((gg: any) => gg.gameId) : [],
        }) as GenreResponseDto,
    );

    return PaginatedGenresResponseDto.from(mapped, page, limit, total);
  }

  async findById(id: string): Promise<GenreResponseDto> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { games: { select: { gameId: true } } },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return {
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      description: genre.description,
      games: genre.games ? genre.games.map((g) => g.gameId) : [],
    } as GenreResponseDto;
  }

  async findBySlug(slug: string): Promise<GenreResponseDto> {
    const genre = await this.prisma.genre.findUnique({
      where: { slug },
      include: { games: { select: { gameId: true } } },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return {
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      description: genre.description,
      games: genre.games ? genre.games.map((g) => g.gameId) : [],
    } as GenreResponseDto;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<GenreResponseDto> {
    const existingGenre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      throw new NotFoundException('Genre not found');
    }

    const updateData = { ...updateGenreDto };

    // Generate new slug if name changed
    if (updateData.name && updateData.name !== existingGenre.name) {
      (updateData as any).slug = this.generateSlug(updateData.name);
    }

    try {
      const genre = await this.prisma.genre.update({
        where: { id },
        data: updateData,
        include: { games: { select: { gameId: true } } },
      });

      return {
        id: genre.id,
        name: genre.name,
        slug: genre.slug,
        description: genre.description,
        games: genre.games ? genre.games.map((g) => g.gameId) : [],
      } as GenreResponseDto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Genre with this name already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    if (genre._count.games > 0) {
      throw new BadRequestException(
        'Cannot delete genre that has associated games. Remove games first.',
      );
    }

    await this.prisma.genre.delete({
      where: { id },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
