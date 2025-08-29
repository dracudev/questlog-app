import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreatePublisherDto {
  @ApiProperty({ description: 'Publisher name', example: 'Nintendo' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Publisher description' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: 'Publisher website' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Publisher logo URL' })
  @IsOptional()
  @IsUrl()
  logo?: string;
}
