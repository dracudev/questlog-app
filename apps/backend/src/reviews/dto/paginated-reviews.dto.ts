import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';
import { ReviewResponseDto } from './review-response.dto';

export class PaginatedReviewsResponseDto extends PaginatedResponseDto<ReviewResponseDto> {
  @ApiProperty({ type: [ReviewResponseDto] })
  items: ReviewResponseDto[];

  static from(
    items: ReviewResponseDto[],
    page: number,
    limit: number,
    total: number,
  ): PaginatedReviewsResponseDto {
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
