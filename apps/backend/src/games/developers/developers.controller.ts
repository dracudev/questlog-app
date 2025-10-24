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
import { DevelopersService } from './developers.service';
import {
  CreateDeveloperDto,
  UpdateDeveloperDto,
  DeveloperResponseDto,
  PaginatedDevelopersResponseDto,
} from './dto';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Developers')
@Controller('games/developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new developer',
    description: 'Creates a new game developer. Requires admin or moderator role.',
  })
  @ApiCreatedResponse({
    description: 'Developer created successfully',
    type: DeveloperResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or developer already exists' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin or moderator role required' })
  async create(@Body() createDeveloperDto: CreateDeveloperDto): Promise<DeveloperResponseDto> {
    return await this.developersService.create(createDeveloperDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all developers',
    description: 'Retrieves a paginated list of all game developers',
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
    description: 'Search by developer name',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'Filter by country',
  })
  @ApiQuery({
    name: 'includeGames',
    required: false,
    type: Boolean,
    description: 'Include games in response (default: false)',
  })
  @ApiOkResponse({
    description: 'Developers retrieved successfully',
    type: PaginatedDevelopersResponseDto,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('country') country?: string,
    @Query('includeGames') includeGames = false,
  ): Promise<PaginatedDevelopersResponseDto> {
    // Validate and sanitize pagination params
    const sanitizedPage = Math.max(1, Number(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, Number(limit) || 20));

    return await this.developersService.findAll({
      page: sanitizedPage,
      limit: sanitizedLimit,
      search,
      country,
      includeGames: Boolean(includeGames),
    });
  }

  @Get(':identifier')
  @Public()
  @ApiOperation({
    summary: 'Get developer by ID or slug',
    description: 'Retrieves a specific developer by their ID or slug',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Developer ID (UUID) or slug',
  })
  @ApiQuery({
    name: 'includeGames',
    required: false,
    type: Boolean,
    description: 'Include games in response (default: true)',
  })
  @ApiOkResponse({
    description: 'Developer found',
    type: DeveloperResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Developer not found' })
  async findOne(
    @Param('identifier') identifier: string,
    @Query('includeGames') includeGames = true,
  ): Promise<DeveloperResponseDto> {
    // Check if identifier is a UUID or slug
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

    if (isUUID) {
      return await this.developersService.findByIdWithOptions(identifier, Boolean(includeGames));
    } else {
      return await this.developersService.findBySlugWithOptions(identifier, Boolean(includeGames));
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a developer',
    description: 'Updates an existing developer. Requires admin or moderator role.',
  })
  @ApiParam({ name: 'id', description: 'Developer ID' })
  @ApiOkResponse({
    description: 'Developer updated successfully',
    type: DeveloperResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Developer not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin or moderator role required' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
  ): Promise<DeveloperResponseDto> {
    return await this.developersService.update(id, updateDeveloperDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a developer',
    description:
      'Deletes a developer. Only possible if no games are associated. Requires admin role.',
  })
  @ApiParam({ name: 'id', description: 'Developer ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Developer deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Developer not found' })
  @ApiBadRequestResponse({ description: 'Cannot delete developer with associated games' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.developersService.remove(id);
  }

  @Get(':id/games')
  @Public()
  @ApiOperation({
    summary: 'Get games by developer',
    description: 'Retrieves all games developed by a specific developer',
  })
  @ApiParam({ name: 'id', description: 'Developer ID or slug' })
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
  @ApiOkResponse({
    description: 'Developer games retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Developer not found' })
  async findDeveloperGames(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const sanitizedPage = Math.max(1, Number(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, Number(limit) || 20));

    return await this.developersService.findDeveloperGames(id, {
      page: sanitizedPage,
      limit: sanitizedLimit,
    });
  }

  @Get(':id/stats')
  @Public()
  @ApiOperation({
    summary: 'Get developer statistics',
    description: 'Retrieves statistics for a developer (game count, average rating, etc.)',
  })
  @ApiParam({ name: 'id', description: 'Developer ID or slug' })
  @ApiOkResponse({ description: 'Developer statistics retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Developer not found' })
  async getDeveloperStats(@Param('id') id: string) {
    return await this.developersService.getDeveloperStats(id);
  }
}
