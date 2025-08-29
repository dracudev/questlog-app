import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
  IsUrl,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameStatus } from '@prisma/client';

export class CreateGameDto {
  @ApiProperty({ example: 'The Witcher 3: Wild Hunt' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'the-witcher-3-wild-hunt' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'An epic open-world RPG adventure...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Award-winning RPG from CD Projekt RED' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({ example: '2015-05-19T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiPropertyOptional({ enum: GameStatus, default: GameStatus.RELEASED })
  @IsOptional()
  @IsEnum(GameStatus)
  status?: GameStatus;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/screen1.jpg', 'https://example.com/screen2.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  screenshots?: string[];

  @ApiPropertyOptional({ example: ['https://youtube.com/watch?v=abc123'] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  videos?: string[];

  @ApiPropertyOptional({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  @IsOptional()
  @IsUUID()
  developerId?: string;

  @ApiPropertyOptional({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  @IsOptional()
  @IsUUID()
  publisherId?: string;

  @ApiPropertyOptional({
    example: ['cm2a3b4c5d6e7f8g9h0i', 'cm2a3b4c5d6e7f8g9h0j'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  genreIds?: string[];

  @ApiPropertyOptional({
    example: ['cm2a3b4c5d6e7f8g9h0i', 'cm2a3b4c5d6e7f8g9h0j'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  platformIds?: string[];

  @ApiPropertyOptional({ example: 12345 })
  @IsOptional()
  rawgId?: number;

  @ApiPropertyOptional({ example: 67890 })
  @IsOptional()
  igdbId?: number;

  @ApiPropertyOptional({ example: 292030 })
  @IsOptional()
  steamId?: number;

  @ApiPropertyOptional({ example: 'the-witcher-3-wild-hunt' })
  @IsOptional()
  @IsString()
  metacriticId?: string;
}
