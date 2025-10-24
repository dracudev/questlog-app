import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

import { DevelopersController } from './developers/developers.controller';
import { DevelopersService } from './developers/developers.service';
import { PublishersController } from './publishers/publishers.controller';
import { PublishersService } from './publishers/publishers.service';
import { PlatformsController } from './platforms/platforms.controller';
import { PlatformsService } from './platforms/platforms.service';
import { GenresController } from './genres/genres.controller';
import { GenresService } from './genres/genres.service';

@Module({
  controllers: [
    DevelopersController,
    PublishersController,
    PlatformsController,
    GenresController,
    GamesController,
  ],
  providers: [GamesService, DevelopersService, PublishersService, PlatformsService, GenresService],
  exports: [GamesService, DevelopersService, PublishersService, PlatformsService, GenresService],
})
export class GamesModule {}
