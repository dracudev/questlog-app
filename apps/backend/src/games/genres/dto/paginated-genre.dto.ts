import { ApiProperty } from '@nestjs/swagger';
import { GenreResponseDto } from './genre-response.dto';
import { DeleteSuccessResponseDto } from '../../dto/delete-success-response.dto';

export class PaginatedGenresResponseDto {
  @ApiProperty({ type: [GenreResponseDto] })
  data: GenreResponseDto[];

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
    data: GenreResponseDto[],
    page: number,
    limit: number,
    total: number,
    deleteSuccess?: DeleteSuccessResponseDto,
  ): PaginatedGenresResponseDto {
    const totalPages = Math.ceil(total / limit);
    return Object.assign(new PaginatedGenresResponseDto(), {
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
