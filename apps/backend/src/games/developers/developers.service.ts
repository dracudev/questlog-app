import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { DeveloperResponseDto } from './dto/developer-response.dto';
import { PaginatedDevelopersResponseDto } from './dto/paginated-developer.dto';

@Injectable()
export class DevelopersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDeveloperDto: CreateDeveloperDto): Promise<DeveloperResponseDto> {
    const slug = this.generateSlug(createDeveloperDto.name);

    try {
      const developer = await this.prisma.developer.create({
        data: {
          ...createDeveloperDto,
          slug,
        },
      });

      return developer;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Developer with this name already exists');
        }
      }
      throw error;
    }
  }

  async findAll({
    page = 1,
    limit = 20,
    search,
    country,
    includeGames = false,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    includeGames?: boolean;
  }): Promise<PaginatedDevelopersResponseDto> {
    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' as const };
    }
    if (country) {
      where.country = { equals: country };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.developer.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: includeGames
          ? { games: { select: { id: true, title: true, slug: true } } }
          : undefined,
      }),
      this.prisma.developer.count({ where }),
    ]);

    // Map prisma Developer to DeveloperResponseDto shape
    const mapped = data.map(
      (d: any) =>
        ({
          id: d.id,
          name: d.name,
          slug: d.slug,
          logo: d.logo,
          country: d.country,
          description: d.description,
          games: includeGames && d.games ? d.games.map((g: any) => g.id) : undefined,
        }) as DeveloperResponseDto,
    );

    return PaginatedDevelopersResponseDto.from(mapped, page, limit, total);
  }

  async findById(id: string): Promise<DeveloperResponseDto> {
    const developer = await this.prisma.developer.findUnique({
      where: { id },
    });

    if (!developer) {
      throw new NotFoundException('Developer not found');
    }

    return developer;
  }

  async findBySlug(slug: string): Promise<DeveloperResponseDto> {
    const developer = await this.prisma.developer.findUnique({
      where: { slug },
    });

    if (!developer) {
      throw new NotFoundException('Developer not found');
    }

    return developer;
  }

  // Controller expects optional includeGames boolean param on these lookups
  async findByIdWithOptions(id: string, includeGames = false): Promise<DeveloperResponseDto> {
    const developer = await this.prisma.developer.findUnique({
      where: { id },
      include: includeGames
        ? { games: { select: { id: true, title: true, slug: true } } }
        : undefined,
    });

    if (!developer) throw new NotFoundException('Developer not found');

    return {
      id: developer.id,
      name: developer.name,
      slug: developer.slug,
      logo: developer.logo,
      country: developer.country,
      description: developer.description,
      games: includeGames && developer.games ? developer.games.map((g: any) => g.id) : undefined,
    } as DeveloperResponseDto;
  }

  async findBySlugWithOptions(slug: string, includeGames = false): Promise<DeveloperResponseDto> {
    const developer = await this.prisma.developer.findUnique({
      where: { slug },
      include: includeGames
        ? { games: { select: { id: true, title: true, slug: true } } }
        : undefined,
    });

    if (!developer) throw new NotFoundException('Developer not found');

    return {
      id: developer.id,
      name: developer.name,
      slug: developer.slug,
      logo: developer.logo,
      country: developer.country,
      description: developer.description,
      games: includeGames && developer.games ? developer.games.map((g: any) => g.id) : undefined,
    } as DeveloperResponseDto;
  }

  async findDeveloperGames(identifier: string, opts: { page?: number; limit?: number }) {
    // allow identifier to be id or slug
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    const dev = isUUID
      ? await this.prisma.developer.findUnique({ where: { id: identifier } })
      : await this.prisma.developer.findUnique({ where: { slug: identifier } });

    if (!dev) throw new NotFoundException('Developer not found');

    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(100, Math.max(1, opts.limit || 20));

    const [games, total] = await this.prisma.$transaction([
      this.prisma.game.findMany({
        where: { developerId: dev.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { title: 'asc' },
        select: { id: true, title: true, slug: true },
      }),
      this.prisma.game.count({ where: { developerId: dev.id } }),
    ]);

    return {
      data: games,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  }

  async getDeveloperStats(identifier: string) {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    const dev = isUUID
      ? await this.prisma.developer.findUnique({ where: { id: identifier } })
      : await this.prisma.developer.findUnique({ where: { slug: identifier } });

    if (!dev) throw new NotFoundException('Developer not found');

    const totalGames = await this.prisma.game.count({ where: { developerId: dev.id } });
    const avgRatingObj = await this.prisma.game.aggregate({
      _avg: { averageRating: true },
      where: { developerId: dev.id },
    });

    return {
      developerId: dev.id,
      totalGames,
      averageRating: avgRatingObj._avg.averageRating || 0,
    };
  }

  async update(id: string, updateDeveloperDto: UpdateDeveloperDto): Promise<DeveloperResponseDto> {
    const existingDeveloper = await this.prisma.developer.findUnique({
      where: { id },
    });

    if (!existingDeveloper) {
      throw new NotFoundException('Developer not found');
    }

    const updateData = { ...updateDeveloperDto };

    // Generate new slug if name changed
    if (updateData.name && updateData.name !== existingDeveloper.name) {
      updateData.slug = this.generateSlug(updateData.name);
    }

    try {
      const developer = await this.prisma.developer.update({
        where: { id },
        data: updateData,
      });

      return developer;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Developer with this name already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const developer = await this.prisma.developer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    if (!developer) {
      throw new NotFoundException('Developer not found');
    }

    if (developer._count.games > 0) {
      throw new BadRequestException(
        'Cannot delete developer that has associated games. Remove games first.',
      );
    }

    await this.prisma.developer.delete({
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
