import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { PaginatedGenresResponseDto } from './dto/paginated-genre.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new genre',
    description: 'Creates a new game genre. Requires admin or moderator role.',
  })
  @ApiCreatedResponse({
    description: 'Genre created successfully',
    type: GenreResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or genre already exists' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin or moderator role required' })
  async create(@Body() createGenreDto: CreateGenreDto): Promise<GenreResponseDto> {
    return await this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all genres',
    description: 'Retrieves a paginated list of all game genres',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20, max: 100)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by genre name',
  })
  @ApiOkResponse({
    description: 'Genres retrieved successfully',
    type: PaginatedGenresResponseDto,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ): Promise<PaginatedGenresResponseDto> {
    const sanitizedPage = Math.max(1, Number(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    return await this.genresService.findAll({
      page: sanitizedPage,
      limit: sanitizedLimit,
      search,
    });
  }

  @Get(':identifier')
  @ApiOperation({
    summary: 'Get genre by ID or slug',
    description: 'Retrieves a specific genre by their ID or slug',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Genre ID (UUID) or slug',
  })
  @ApiOkResponse({
    description: 'Genre found',
    type: GenreResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Genre not found' })
  async findOne(@Param('identifier') identifier: string): Promise<GenreResponseDto> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    if (isUUID) {
      return await this.genresService.findById(identifier);
    } else {
      return await this.genresService.findBySlug(identifier);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a genre',
    description: 'Updates an existing genre. Requires admin or moderator role.',
  })
  @ApiParam({ name: 'id', description: 'Genre ID' })
  @ApiOkResponse({
    description: 'Genre updated successfully',
    type: GenreResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Genre not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin or moderator role required' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<GenreResponseDto> {
    return await this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a genre',
    description: 'Deletes a genre. Only possible if no games are associated. Requires admin role.',
  })
  @ApiParam({ name: 'id', description: 'Genre ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Genre deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Genre not found' })
  @ApiBadRequestResponse({ description: 'Cannot delete genre with associated games' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.genresService.remove(id);
  }
}
