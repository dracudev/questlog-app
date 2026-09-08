import { Module } from '@nestjs/common';
import { IgdbAuthService } from './igdb-auth.service';
import { IgdbClientService } from './igdb-client.service';

@Module({
  providers: [IgdbAuthService, IgdbClientService],
  exports: [IgdbAuthService, IgdbClientService],
})
export class IgdbModule {}
