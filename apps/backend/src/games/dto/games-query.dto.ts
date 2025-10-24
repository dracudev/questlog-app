import { ApiPropertyOptional, ApiExtraModels } from '@nestjs/swagger';
import { IsOptional, IsArray, IsEnum, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { GameFiltersDto } from './game-filters.dto';
import { GameStatus } from '@prisma/client';
import { SORT_FIELDS, SORT_ORDERS } from '../constants/games.constants';

@ApiExtraModels(PaginationQueryDto, GameFiltersDto)
export class GamesQueryDto extends PaginationQueryDto implements GameFiltersDto {
  @ApiPropertyOptional({ example: ['cm2a3b4c5d6e7f8g9h0i'] })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  genreIds?: string[];

  @ApiPropertyOptional({ example: ['cm2a3b4c5d6e7f8g9h0i'] })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsString({ each: true })
  platformIds?: string[];

  @ApiPropertyOptional({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  @IsOptional()
  @IsString()
  developerId?: string;

  @ApiPropertyOptional({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  @IsOptional()
  @IsString()
  publisherId?: string;

  @ApiPropertyOptional({ enum: GameStatus })
  @IsOptional()
  @IsEnum(GameStatus)
  status?: GameStatus;

  @ApiPropertyOptional({ example: 7.0, minimum: 0, maximum: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  minRating?: number;

  @ApiPropertyOptional({ example: 9.0, minimum: 0, maximum: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  maxRating?: number;

  @ApiPropertyOptional({
    enum: SORT_FIELDS,
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(SORT_FIELDS)
  sortBy?: string;

  @ApiPropertyOptional({ enum: SORT_ORDERS, default: 'desc' })
  @IsOptional()
  @IsEnum(SORT_ORDERS)
  sortOrder?: 'asc' | 'desc';
}
