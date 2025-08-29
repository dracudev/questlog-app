import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameResponseDto } from './dto/game-response.dto';
import { GameDetailDto } from './dto/game-detail.dto';
import { GameFiltersDto } from './dto/game-filters.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedGamesResponseDto } from './dto/paginated-game.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { GamesQueryDto } from './dto/games-query.dto';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new game (Admin/Moderator only)' })
  @ApiResponse({
    status: 201,
    description: 'Game created successfully',
    type: GameResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Moderator role required',
  })
  async create(@Body() createGameDto: CreateGameDto): Promise<GameResponseDto> {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all games with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Games retrieved successfully' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'genreIds', required: false, type: [String] })
  @ApiQuery({ name: 'platformIds', required: false, type: [String] })
  @ApiQuery({ name: 'developerId', required: false, type: String })
  @ApiQuery({ name: 'publisherId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'maxRating', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  async findAll(@Query() query: GamesQueryDto): Promise<PaginatedGamesResponseDto> {
    return this.gamesService.findAll(query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get game details by slug' })
  @ApiParam({ name: 'slug', description: 'Game slug' })
  @ApiResponse({
    status: 200,
    description: 'Game details retrieved successfully',
    type: GameDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async findBySlug(@Param('slug') slug: string): Promise<GameDetailDto> {
    return this.gamesService.findBySlug(slug);
  }

  @Get(':id/similar')
  @Public()
  @ApiOperation({ summary: 'Get similar games' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of similar games to return',
  })
  @ApiResponse({
    status: 200,
    description: 'Similar games retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async getSimilarGames(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ): Promise<GameResponseDto[]> {
    return this.gamesService.getSimilarGames(id, limit);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update game (Admin/Moderator only)' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({
    status: 200,
    description: 'Game updated successfully',
    type: GameResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Moderator role required',
  })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<GameResponseDto> {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete game (Admin only)' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({ status: 204, description: 'Game deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.gamesService.remove(id);
  }
}
