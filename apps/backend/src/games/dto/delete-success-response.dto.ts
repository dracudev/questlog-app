import { ApiProperty } from '@nestjs/swagger';

export class DeleteSuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Resource deleted successfully.' })
  message: string;

  static success(message = 'Resource deleted successfully.'): DeleteSuccessResponseDto {
    return Object.assign(new DeleteSuccessResponseDto(), {
      success: true,
      message,
    });
  }
}
