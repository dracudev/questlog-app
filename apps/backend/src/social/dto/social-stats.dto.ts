import { ApiProperty } from '@nestjs/swagger';

export class SocialStatsDto {
  @ApiProperty({ description: 'Number of followers' })
  followersCount: number;

  @ApiProperty({ description: 'Number of users being followed' })
  followingCount: number;

  @ApiProperty({ description: 'Number of reviews written' })
  reviewsCount: number;

  @ApiProperty({ description: 'Number of likes received on reviews' })
  likesReceived: number;
}
