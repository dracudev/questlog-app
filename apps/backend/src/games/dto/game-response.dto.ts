import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeveloperResponseDto } from '../developers/dto/developer-response.dto';
import { PublisherResponseDto } from '../publishers/dto/publisher-response.dto';
import { GenreResponseDto } from '../genres/dto/genre-response.dto';
import { PlatformResponseDto } from '../platforms/dto/platform-response.dto';

export class GameBasicDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'The Witcher 3: Wild Hunt' })
  title: string;

  @ApiProperty({ example: 'the-witcher-3-wild-hunt' })
  slug: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  coverImage?: string;

  @ApiPropertyOptional({ example: '2015-05-19T00:00:00.000Z' })
  releaseDate?: Date;

  @ApiProperty({ example: 'RELEASED' })
  status: string;

  @ApiPropertyOptional({ example: 9.2 })
  averageRating?: number;

  @ApiProperty({ example: 1250 })
  reviewCount: number;
}

export class GameResponseDto {
  @ApiProperty({ type: GameBasicDto })
  game: GameBasicDto;

  @ApiPropertyOptional({ example: 'An epic open-world RPG adventure...' })
  description?: string;

  @ApiPropertyOptional({ example: 'Award-winning RPG from CD Projekt RED' })
  summary?: string;

  @ApiProperty({ example: ['https://example.com/screen1.jpg'] })
  screenshots: string[];

  @ApiProperty({ example: ['https://youtube.com/watch?v=abc123'] })
  videos: string[];

  @ApiProperty({ example: 5000 })
  playCount: number;

  @ApiPropertyOptional({ type: DeveloperResponseDto })
  developer?: DeveloperResponseDto;

  @ApiPropertyOptional({ type: PublisherResponseDto })
  publisher?: PublisherResponseDto;

  @ApiProperty({ type: [GenreResponseDto] })
  genres: GenreResponseDto[];

  @ApiProperty({ type: [PlatformResponseDto] })
  platforms: PlatformResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-16T15:45:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: 3328 })
  rawgId?: number;

  @ApiPropertyOptional({ example: 1942 })
  igdbId?: number;

  @ApiPropertyOptional({ example: 292030 })
  steamId?: number;

  @ApiPropertyOptional({ example: 'the-witcher-3-wild-hunt' })
  metacriticId?: string;
}
