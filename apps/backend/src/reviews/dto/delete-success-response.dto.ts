import { ApiProperty } from '@nestjs/swagger';

export class DeleteSuccessResponseDto {
  @ApiProperty({ example: 204 })
  statusCode: number;

  @ApiProperty({ example: 'Review deleted successfully' })
  message: string;
}
