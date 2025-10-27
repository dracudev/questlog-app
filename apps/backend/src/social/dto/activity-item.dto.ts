import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewGameDto, ReviewStatsDto } from '@/reviews/dto/review-response.dto';

export class ActivityUserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Display name' })
  displayName: string;

  @ApiProperty({ description: 'Avatar URL' })
  avatar: string;
}

// Lightweight DTO used for feed payloads (smaller than full ReviewResponseDto)
export class ReviewFeedDto {
  @ApiProperty({ description: 'Review ID' })
  id: string;

  @ApiPropertyOptional({ description: 'Review title' })
  title?: string;

  @ApiPropertyOptional({ description: 'Optional review content or snippet' })
  content?: string;

  @ApiProperty({ description: 'Review rating' })
  rating: number;

  @ApiProperty({ description: 'Game summary for the review', type: ReviewGameDto })
  game: ReviewGameDto;

  @ApiProperty({ description: 'Review statistics', type: ReviewStatsDto })
  stats: ReviewStatsDto;
}

export class ActivityItemDto {
  @ApiProperty({ description: 'Activity ID' })
  id: string;

  @ApiProperty({ description: 'Activity type' })
  type: string;

  @ApiProperty({ description: 'User ID who performed the activity' })
  userId: string;

  @ApiProperty({ description: 'User who performed the activity', type: ActivityUserDto })
  user: ActivityUserDto;

  @ApiPropertyOptional({ description: 'Target ID (e.g., game ID, user ID)' })
  targetId?: string;

  @ApiPropertyOptional({ description: 'Target type (e.g., game, user)' })
  targetType?: string;

  @ApiPropertyOptional({ description: 'Review details, if type is REVIEW_*', type: ReviewFeedDto })
  review?: ReviewFeedDto;

  @ApiPropertyOptional({
    description: 'Followed user details, if type is FOLLOW',
    type: ActivityUserDto,
  })
  followedUser?: ActivityUserDto;

  @ApiPropertyOptional({ description: 'Additional activity metadata' })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Activity creation date' })
  createdAt: Date;
}
