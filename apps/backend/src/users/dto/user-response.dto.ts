import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserStatsDto {
  @ApiProperty({ example: 15 })
  reviewsCount: number;

  @ApiProperty({ example: 42 })
  followersCount: number;

  @ApiProperty({ example: 38 })
  followingCount: number;
}

export class UserResponseDto {
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

  @ApiProperty({ type: UserStatsDto })
  stats: UserStatsDto;
}
