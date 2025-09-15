import { ApiProperty } from '@nestjs/swagger';
import { ActivityItemDto } from './activity-item.dto';

export class ActivityFeedMetaDto {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNext: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPrev: boolean;
}

export class ActivityFeedResponseDto {
  @ApiProperty({ description: 'Array of activity items', type: [ActivityItemDto] })
  items: ActivityItemDto[];

  @ApiProperty({ description: 'Pagination metadata', type: ActivityFeedMetaDto })
  meta: ActivityFeedMetaDto;
}
