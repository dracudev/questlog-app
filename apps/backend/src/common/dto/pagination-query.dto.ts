import { IsOptional, IsPositive, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GAMES_CONSTANTS } from '../../games/constants/games.constants';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = GAMES_CONSTANTS.PAGINATION.DEFAULT_PAGE;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(GAMES_CONSTANTS.PAGINATION.MAX_LIMIT)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'witcher', description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;
}
