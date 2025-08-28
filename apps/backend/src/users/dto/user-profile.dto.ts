import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GameBasicInfoDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'The Witcher 3: Wild Hunt' })
  title: string;

  @ApiProperty({ example: 'the-witcher-3-wild-hunt' })
  slug: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  coverImage?: string;
}

export class ReviewStatsDto {
  @ApiProperty({ example: 15 })
  likesCount: number;

  @ApiProperty({ example: 3 })
  commentsCount: number;
}

export class RecentReviewDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiPropertyOptional({ example: 'Amazing RPG Experience' })
  title?: string;

  @ApiProperty({
    example: 'This game is absolutely incredible. The story, characters, and world-building...',
  })
  content: string;

  @ApiProperty({ example: 9.5, minimum: 0, maximum: 10 })
  rating: number;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: GameBasicInfoDto })
  game: GameBasicInfoDto;

  @ApiProperty({ type: ReviewStatsDto })
  stats: ReviewStatsDto;
}

export class GameListBasicDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'My Favorite RPGs' })
  name: string;

  @ApiPropertyOptional({ example: 'A collection of my all-time favorite RPG games' })
  description?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-16T15:45:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: 'object', properties: { entries: { type: 'number', example: 12 } } })
  _count: { entries: number };
}

export class UserProfileStatsDto {
  @ApiProperty({ example: 15 })
  reviewsCount: number;

  @ApiProperty({ example: 42 })
  followersCount: number;

  @ApiProperty({ example: 38 })
  followingCount: number;

  @ApiProperty({ example: 5 })
  gameListsCount: number;
}

export class UserProfileDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'gamer123' })
  username: string;

  @ApiPropertyOptional({ example: 'Awesome Gamer' })
  displayName?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string;

  @ApiPropertyOptional({ example: 'A passionate gamer who loves RPGs and indie games.' })
  bio?: string;

  @ApiPropertyOptional({ example: 'New York, USA' })
  location?: string;

  @ApiPropertyOptional({ example: 'https://myblog.com' })
  website?: string;

  @ApiProperty({ example: false })
  isPrivate: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: UserProfileStatsDto })
  stats: UserProfileStatsDto;

  @ApiProperty({ example: false })
  isFollowing: boolean;

  @ApiProperty({ type: [RecentReviewDto] })
  recentReviews: RecentReviewDto[];

  @ApiProperty({ type: [GameListBasicDto] })
  gameLists: GameListBasicDto[];
}
