import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FollowUserDto {
  @ApiPropertyOptional({ description: 'User ID to follow/unfollow' })
  @IsString()
  userId: string;
}
