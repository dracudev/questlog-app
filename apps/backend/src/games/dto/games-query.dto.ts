import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { GameFiltersDto } from './game-filters.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(PaginationQueryDto, GameFiltersDto)
export class GamesQueryDto extends PaginationQueryDto implements GameFiltersDto {
  // PaginationQueryDto: page, limit, search
  // GameFiltersDto: genreIds, platformIds, developerId, publisherId, status, minRating, maxRating, sortBy, sortOrder

  genreIds?: string[];
  platformIds?: string[];
  developerId?: string;
  publisherId?: string;
  status?: any;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
