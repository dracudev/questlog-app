import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreatePlatformDto {
  @ApiProperty({ description: 'Platform name', example: 'Nintendo Switch' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Platform abbreviation', example: 'NSW' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  abbreviation?: string;
}
