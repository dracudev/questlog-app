import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({ description: 'Additional activity metadata' })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Activity creation date' })
  createdAt: Date;
}
