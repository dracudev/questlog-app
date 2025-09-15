import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SOCIAL_CONSTANTS } from '../constants/social.constants';

export class ActivityFeedQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: SOCIAL_CONSTANTS.PAGINATION.DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = SOCIAL_CONSTANTS.PAGINATION.DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: SOCIAL_CONSTANTS.FEED.DEFAULT_LIMIT,
    maximum: SOCIAL_CONSTANTS.FEED.MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(SOCIAL_CONSTANTS.FEED.MAX_LIMIT)
  limit?: number = SOCIAL_CONSTANTS.FEED.DEFAULT_LIMIT;

  @ApiPropertyOptional({ description: 'Filter by activity type' })
  @IsOptional()
  @IsString()
  type?: string;
}
