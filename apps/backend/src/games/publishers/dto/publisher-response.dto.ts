import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublisherResponseDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'CD Projekt' })
  name: string;

  @ApiProperty({ example: 'cd-projekt' })
  slug: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.jpg' })
  logo?: string;

  @ApiProperty({ example: ['cm2a3b4c5d6e7f8g9h0i'] })
  games: string[];

  @ApiPropertyOptional({ example: 'Leading publisher in Europe.' })
  description?: string;
}
