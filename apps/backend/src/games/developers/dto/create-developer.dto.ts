import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDeveloperDto {
  @ApiProperty({ description: 'Developer name', example: 'Nintendo EPD' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Developer description' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: 'Developer website' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Developer logo URL' })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ description: 'Developer country', example: 'Japan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ description: 'Founded year', example: 2015 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  foundedYear?: number;

  @ApiPropertyOptional({ example: 'cd-projekt-red' })
  @IsOptional()
  @IsString()
  slug?: string;
}
