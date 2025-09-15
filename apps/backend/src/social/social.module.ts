import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { UsersModule } from '@/users/users.module';
import { ReviewsModule } from '@/reviews/reviews.module';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [DatabaseModule, UsersModule, ReviewsModule],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
