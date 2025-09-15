import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { PlatformResponseDto } from './dto/platform-response.dto';
import { PaginatedPlatformsResponseDto } from './dto/paginated-platform.dto';

@Injectable()
export class PlatformsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPlatformDto: CreatePlatformDto): Promise<PlatformResponseDto> {
    const slug = this.generateSlug(createPlatformDto.name);

    try {
      const platform = await this.prisma.platform.create({
        data: {
          ...createPlatformDto,
          slug,
        },
      });

      // New platform has no games yet; map to response DTO shape
      return {
        id: platform.id,
        name: platform.name,
        slug: platform.slug,
        abbreviation: platform.abbreviation,
        games: [],
      } as PlatformResponseDto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Platform with this name already exists');
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
  }): Promise<PaginatedPlatformsResponseDto> {
    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.platform.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { games: { select: { gameId: true } } },
      }),
      this.prisma.platform.count({ where }),
    ]);

    const mapped = data.map(
      (p: any) =>
        ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          abbreviation: p.abbreviation,
          games: p.games ? p.games.map((g: any) => g.gameId) : [],
        }) as PlatformResponseDto,
    );

    return PaginatedPlatformsResponseDto.from(mapped, page, limit, total);
  }

  async findById(id: string): Promise<PlatformResponseDto> {
    const platform = await this.prisma.platform.findUnique({
      where: { id },
      include: { games: { select: { gameId: true } } },
    });

    if (!platform) {
      throw new NotFoundException('Platform not found');
    }

    return {
      id: platform.id,
      name: platform.name,
      slug: platform.slug,
      abbreviation: platform.abbreviation,
      games: platform.games ? platform.games.map((g) => g.gameId) : [],
    } as PlatformResponseDto;
  }

  async findBySlug(slug: string): Promise<PlatformResponseDto> {
    const platform = await this.prisma.platform.findUnique({
      where: { slug },
      include: { games: { select: { gameId: true } } },
    });

    if (!platform) {
      throw new NotFoundException('Platform not found');
    }

    return {
      id: platform.id,
      name: platform.name,
      slug: platform.slug,
      abbreviation: platform.abbreviation,
      games: platform.games ? platform.games.map((g) => g.gameId) : [],
    } as PlatformResponseDto;
  }

  async update(id: string, updatePlatformDto: UpdatePlatformDto): Promise<PlatformResponseDto> {
    const existingPlatform = await this.prisma.platform.findUnique({
      where: { id },
    });

    if (!existingPlatform) {
      throw new NotFoundException('Platform not found');
    }

    const updateData = { ...updatePlatformDto };

    // Generate new slug if name changed
    if ((updateData as any).name && (updateData as any).name !== existingPlatform.name) {
      (updateData as any).slug = this.generateSlug((updateData as any).name);
    }

    try {
      const platform = await this.prisma.platform.update({
        where: { id },
        data: updateData,
        include: { games: { select: { gameId: true } } },
      });

      return {
        id: platform.id,
        name: platform.name,
        slug: platform.slug,
        abbreviation: platform.abbreviation,
        games: platform.games ? platform.games.map((g) => g.gameId) : [],
      } as PlatformResponseDto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Platform with this name already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const platform = await this.prisma.platform.findUnique({
      where: { id },
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    if (!platform) {
      throw new NotFoundException('Platform not found');
    }

    if (platform._count.games > 0) {
      throw new BadRequestException(
        'Cannot delete platform that has associated games. Remove games first.',
      );
    }

    await this.prisma.platform.delete({
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
