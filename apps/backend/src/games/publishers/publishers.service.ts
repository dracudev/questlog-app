import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherResponseDto } from './dto/publisher-response.dto';
import { PaginatedPublishersResponseDto } from './dto/paginated-publisher.dto';

@Injectable()
export class PublishersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPublisherDto: CreatePublisherDto): Promise<PublisherResponseDto> {
    const slug = this.generateSlug(createPublisherDto.name);

    try {
      const publisher = await this.prisma.publisher.create({
        data: {
          ...createPublisherDto,
          slug,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          website: true,
          logo: true,
        },
      });

      // Newly created publisher will have no associated games
      return {
        id: publisher.id,
        name: publisher.name,
        slug: publisher.slug,
        description: publisher.description,
        website: publisher.website,
        logo: publisher.logo,
        games: [],
      } as PublisherResponseDto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Publisher with this name already exists');
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
  }: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
  }): Promise<PaginatedPublishersResponseDto> {
    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' as const };
    }
    // Publisher model does not currently have a normalized country field in schema.prisma,
    // so ignore country filtering unless you add it to the schema. Keep parameter for API parity.

    const [data, total] = await this.prisma.$transaction([
      this.prisma.publisher.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { games: { select: { id: true } } },
      }),
      this.prisma.publisher.count({ where }),
    ]);

    const mapped = data.map(
      (p: any) =>
        ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          website: p.website,
          logo: p.logo,
          games: p.games ? p.games.map((g: any) => g.id) : [],
        }) as PublisherResponseDto,
    );

    return PaginatedPublishersResponseDto.from(mapped, page, limit, total);
  }

  async findById(id: string): Promise<PublisherResponseDto> {
    const publisher = await this.prisma.publisher.findUnique({
      where: { id },
      include: { games: { select: { id: true } } },
    });

    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }

    return {
      id: publisher.id,
      name: publisher.name,
      slug: publisher.slug,
      description: publisher.description,
      website: publisher.website,
      logo: publisher.logo,
      games: publisher.games ? publisher.games.map((g) => g.id) : [],
    } as PublisherResponseDto;
  }

  async findBySlug(slug: string): Promise<PublisherResponseDto> {
    const publisher = await this.prisma.publisher.findUnique({
      where: { slug },
      include: { games: { select: { id: true } } },
    });

    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }

    return {
      id: publisher.id,
      name: publisher.name,
      slug: publisher.slug,
      description: publisher.description,
      website: publisher.website,
      logo: publisher.logo,
      games: publisher.games ? publisher.games.map((g) => g.id) : [],
    } as PublisherResponseDto;
  }

  async update(id: string, updatePublisherDto: UpdatePublisherDto): Promise<PublisherResponseDto> {
    const existingPublisher = await this.prisma.publisher.findUnique({
      where: { id },
    });

    if (!existingPublisher) {
      throw new NotFoundException('Publisher not found');
    }

    const updateData = { ...updatePublisherDto };

    // Generate new slug if name changed
    if (updateData.name && updateData.name !== existingPublisher.name) {
      (updateData as any).slug = this.generateSlug(updateData.name);
    }

    try {
      const publisher = await this.prisma.publisher.update({
        where: { id },
        data: updateData,
        include: { games: { select: { id: true } } },
      });

      return {
        id: publisher.id,
        name: publisher.name,
        slug: publisher.slug,
        description: publisher.description,
        website: publisher.website,
        logo: publisher.logo,
        games: publisher.games ? publisher.games.map((g) => g.id) : [],
      } as PublisherResponseDto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Publisher with this name already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const publisher = await this.prisma.publisher.findUnique({
      where: { id },
      include: {
        _count: {
          select: { games: true },
        },
      },
    });

    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }

    if (publisher._count.games > 0) {
      throw new BadRequestException(
        'Cannot delete publisher that has associated games. Remove games first.',
      );
    }

    await this.prisma.publisher.delete({
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
