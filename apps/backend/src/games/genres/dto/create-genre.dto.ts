import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({ description: 'Genre name', example: 'Action-Adventure' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Genre description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
