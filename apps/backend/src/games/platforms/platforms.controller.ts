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
import { PlatformsService } from './platforms.service';
import {
  CreatePlatformDto,
  UpdatePlatformDto,
  PlatformResponseDto,
  PaginatedPlatformsResponseDto,
} from './dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Platforms')
@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new platform',
    description: 'Creates a new game platform. Requires admin or moderator role.',
  })
  @ApiCreatedResponse({
    description: 'Platform created successfully',
    type: PlatformResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or platform already exists' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin or moderator role required' })
  async create(@Body() createPlatformDto: CreatePlatformDto): Promise<PlatformResponseDto> {
    return await this.platformsService.create(createPlatformDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all platforms',
    description: 'Retrieves a paginated list of all game platforms',
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
    description: 'Search by platform name',
  })
  @ApiOkResponse({
    description: 'Platforms retrieved successfully',
    type: PaginatedPlatformsResponseDto,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ): Promise<PaginatedPlatformsResponseDto> {
    const sanitizedPage = Math.max(1, Number(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    return await this.platformsService.findAll({
      page: sanitizedPage,
      limit: sanitizedLimit,
      search,
    });
  }

  @Get(':identifier')
  @Public()
  @ApiOperation({
    summary: 'Get platform by ID or slug',
    description: 'Retrieves a specific platform by their ID or slug',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Platform ID (UUID) or slug',
  })
  @ApiOkResponse({
    description: 'Platform found',
    type: PlatformResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Platform not found' })
  async findOne(@Param('identifier') identifier: string): Promise<PlatformResponseDto> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    if (isUUID) {
      return await this.platformsService.findById(identifier);
    } else {
      return await this.platformsService.findBySlug(identifier);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a platform',
    description: 'Updates an existing platform. Requires admin or moderator role.',
  })
  @ApiParam({ name: 'id', description: 'Platform ID' })
  @ApiOkResponse({
    description: 'Platform updated successfully',
    type: PlatformResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Platform not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin or moderator role required' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ): Promise<PlatformResponseDto> {
    return await this.platformsService.update(id, updatePlatformDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a platform',
    description:
      'Deletes a platform. Only possible if no games are associated. Requires admin role.',
  })
  @ApiParam({ name: 'id', description: 'Platform ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Platform deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Platform not found' })
  @ApiBadRequestResponse({ description: 'Cannot delete platform with associated games' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.platformsService.remove(id);
  }
}
