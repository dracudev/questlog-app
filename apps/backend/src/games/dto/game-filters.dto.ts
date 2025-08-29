import { IsOptional, IsArray, IsEnum, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GameStatus } from '@prisma/client';

export class GameFiltersDto {
  @ApiPropertyOptional({ example: ['cm2a3b4c5d6e7f8g9h0i'] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  genreIds?: string[];

  @ApiPropertyOptional({ example: ['cm2a3b4c5d6e7f8g9h0i'] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  platformIds?: string[];

  @ApiPropertyOptional({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  @IsOptional()
  @IsUUID()
  developerId?: string;

  @ApiPropertyOptional({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  @IsOptional()
  @IsUUID()
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
    enum: ['title', 'releaseDate', 'averageRating', 'reviewCount', 'createdAt'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['title', 'releaseDate', 'averageRating', 'reviewCount', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
