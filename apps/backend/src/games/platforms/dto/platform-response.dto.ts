import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlatformResponseDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'PlayStation 4' })
  name: string;

  @ApiProperty({ example: 'ps4' })
  slug: string;

  @ApiPropertyOptional({ example: 'PS4' })
  abbreviation?: string;

  @ApiProperty({ example: ['cm2a3b4c5d6e7f8g9h0i'] })
  games: string[];
}
