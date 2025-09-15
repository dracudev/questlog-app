import { ApiProperty } from '@nestjs/swagger';
import { PublisherResponseDto } from './publisher-response.dto';
import { DeleteSuccessResponseDto } from '../../dto';

export class PaginatedPublishersResponseDto {
  @ApiProperty({ type: [PublisherResponseDto] })
  data: PublisherResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 156 })
  total: number;

  @ApiProperty({ example: 16 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;

  @ApiProperty({ type: DeleteSuccessResponseDto, required: false })
  deleteSuccess?: DeleteSuccessResponseDto;

  static from(
    data: PublisherResponseDto[],
    page: number,
    limit: number,
    total: number,
    deleteSuccess?: DeleteSuccessResponseDto,
  ): PaginatedPublishersResponseDto {
    const totalPages = Math.ceil(total / limit);
    return Object.assign(new PaginatedPublishersResponseDto(), {
      data,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      deleteSuccess,
    });
  }
}
