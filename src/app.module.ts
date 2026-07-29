import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StoryModule } from './modules/story/story.module';
import { GamificationModule } from './modules/gamification/gamification.module';
import { ProgressModule } from './modules/progress/progress.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { ShopModule } from './modules/shop/shop.module';
import { PaymentModule } from './modules/payment/payment.module';
import { GrowthModule } from './modules/growth/growth.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { VideoModule } from './modules/video/video.module';
import { AdminModule } from './modules/admin/admin.module';
import { ContributionModule } from './modules/contribution/contribution.module';

@Module({
  imports: [
    // ─── Config ──────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ─── Rate Limiting ────────────────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,  // 1 minute
        limit: 60,
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: 1000,
      },
    ]),

    // ─── Cron Jobs ────────────────────────────────────────────────────────
    ScheduleModule.forRoot(),

    // ─── Core ────────────────────────────────────────────────────────────
    PrismaModule,

    // ─── Domain Modules ───────────────────────────────────────────────────
    AuthModule,
    UserModule,
    StoryModule,
    GamificationModule,
    ProgressModule,
    QuizModule,
    ShopModule,
    PaymentModule,
    GrowthModule,
    AccountsModule,
    VideoModule,
    AdminModule,
    ContributionModule,
  ],
})
export class AppModule {}
