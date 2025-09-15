import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewUserDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'gaming_pro' })
  username: string;

  @ApiProperty({ example: 'Gaming Pro' })
  displayName: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  avatar?: string;
}

export class ReviewGameDto {
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

  @ApiProperty({ example: 8 })
  commentsCount: number;
}

export class ReviewResponseDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiPropertyOptional({ example: 'An Epic Adventure' })
  title?: string;

  @ApiProperty({ example: 'This game exceeded all my expectations...' })
  content: string;

  @ApiProperty({ example: 8.5 })
  rating: number;

  @ApiProperty({ example: true })
  isPublished: boolean;

  @ApiProperty({ example: false })
  isSpoiler: boolean;

  @ApiProperty({ type: ReviewUserDto })
  user: ReviewUserDto;

  @ApiProperty({ type: ReviewGameDto })
  game: ReviewGameDto;

  @ApiProperty({ type: ReviewStatsDto })
  stats: ReviewStatsDto;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({
    example: false,
    description:
      'Whether the current user has liked this review (only present for authenticated users)',
  })
  isLiked?: boolean;
}
