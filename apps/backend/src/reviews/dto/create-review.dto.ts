import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { REVIEWS_CONSTANTS } from '../constants/reviews.constants';

export class CreateReviewDto {
  @ApiPropertyOptional({
    example: 'An Epic Adventure',
    description: 'Optional title for the review',
  })
  @IsOptional()
  @IsString()
  @MaxLength(REVIEWS_CONSTANTS.VALIDATION.TITLE_MAX_LENGTH)
  title?: string;

  @ApiProperty({
    example:
      'This game exceeded all my expectations. The storyline is incredible and the gameplay mechanics are innovative...',
    description: 'The main content of the review',
  })
  @IsString()
  @MinLength(REVIEWS_CONSTANTS.VALIDATION.CONTENT_MIN_LENGTH)
  @MaxLength(REVIEWS_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH)
  content: string;

  @ApiProperty({
    example: 8.5,
    description: 'Rating from 0 to 10',
    minimum: REVIEWS_CONSTANTS.VALIDATION.MIN_RATING,
    maximum: REVIEWS_CONSTANTS.VALIDATION.MAX_RATING,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(REVIEWS_CONSTANTS.VALIDATION.MIN_RATING)
  @Max(REVIEWS_CONSTANTS.VALIDATION.MAX_RATING)
  rating: number;

  @ApiProperty({
    example: 'cm2a3b4c5d6e7f8g9h0i',
    description: 'Game ID being reviewed',
  })
  @IsUUID()
  gameId: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the review is published (default: true)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the review contains spoilers (default: false)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSpoiler?: boolean;
}
