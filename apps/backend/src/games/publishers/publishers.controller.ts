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
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherResponseDto } from './dto/publisher-response.dto';
import { PaginatedPublishersResponseDto } from './dto/paginated-publisher.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Publishers')
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new publisher',
    description: 'Creates a new game publisher. Requires admin or moderator role.',
  })
  @ApiCreatedResponse({
    description: 'Publisher created successfully',
    type: PublisherResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or publisher already exists' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin or moderator role required' })
  async create(@Body() createPublisherDto: CreatePublisherDto): Promise<PublisherResponseDto> {
    return await this.publishersService.create(createPublisherDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all publishers',
    description: 'Retrieves a paginated list of all game publishers',
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
    description: 'Search by publisher name',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'Filter by country',
  })
  @ApiOkResponse({
    description: 'Publishers retrieved successfully',
    type: PaginatedPublishersResponseDto,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('country') country?: string,
  ): Promise<PaginatedPublishersResponseDto> {
    const sanitizedPage = Math.max(1, Number(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    return await this.publishersService.findAll({
      page: sanitizedPage,
      limit: sanitizedLimit,
      search,
      country,
    });
  }

  @Get(':identifier')
  @ApiOperation({
    summary: 'Get publisher by ID or slug',
    description: 'Retrieves a specific publisher by their ID or slug',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Publisher ID (UUID) or slug',
  })
  @ApiOkResponse({
    description: 'Publisher found',
    type: PublisherResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Publisher not found' })
  async findOne(@Param('identifier') identifier: string): Promise<PublisherResponseDto> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    if (isUUID) {
      return await this.publishersService.findById(identifier);
    } else {
      return await this.publishersService.findBySlug(identifier);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a publisher',
    description: 'Updates an existing publisher. Requires admin or moderator role.',
  })
  @ApiParam({ name: 'id', description: 'Publisher ID' })
  @ApiOkResponse({
    description: 'Publisher updated successfully',
    type: PublisherResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Publisher not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin or moderator role required' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ): Promise<PublisherResponseDto> {
    return await this.publishersService.update(id, updatePublisherDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a publisher',
    description:
      'Deletes a publisher. Only possible if no games are associated. Requires admin role.',
  })
  @ApiParam({ name: 'id', description: 'Publisher ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Publisher deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Publisher not found' })
  @ApiBadRequestResponse({ description: 'Cannot delete publisher with associated games' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.publishersService.remove(id);
  }
}
