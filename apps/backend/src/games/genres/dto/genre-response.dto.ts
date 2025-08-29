import { ApiProperty } from '@nestjs/swagger';

export class GenreResponseDto {
  @ApiProperty({ example: 'cm2a3b4c5d6e7f8g9h0i' })
  id: string;

  @ApiProperty({ example: 'RPG' })
  name: string;

  @ApiProperty({ example: 'rpg' })
  slug: string;

  @ApiProperty({ example: ['cm2a3b4c5d6e7f8g9h0i'] })
  games: string[];
}
