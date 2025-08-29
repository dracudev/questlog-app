import { ApiProperty } from '@nestjs/swagger';
import { GameResponseDto } from './game-response.dto';

export class PaginatedGamesResponseDto {
  @ApiProperty({ type: [GameResponseDto] })
  data: GameResponseDto[];

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

  static from(
    data: GameResponseDto[],
    page: number,
    limit: number,
    total: number,
  ): PaginatedGamesResponseDto {
    const totalPages = Math.ceil(total / limit);
    return Object.assign(new PaginatedGamesResponseDto(), {
      data,
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
  }
}
