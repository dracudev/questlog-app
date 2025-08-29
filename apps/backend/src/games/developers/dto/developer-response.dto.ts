import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeveloperResponseDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'CD Projekt RED' })
  name: string;

  @ApiProperty({ example: 'cd-projekt-red' })
  slug: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.jpg' })
  logo?: string;

  @ApiPropertyOptional({ example: 'Poland' })
  country?: string;

  @ApiPropertyOptional({ example: 'Award-winning RPG developer.' })
  description?: string;
}
