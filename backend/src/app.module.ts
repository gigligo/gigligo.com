import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BlockedUserGuard } from './auth/blocked-user.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { KycModule } from './kyc/kyc.module';
import { GigModule } from './gig/gig.module';
import { OrderModule } from './order/order.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payment/payment.module';
import { CreditModule } from './credit/credit.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './admin/admin.module';
import { McpModule } from './mcp/mcp.module';
import { AiModule } from './ai/ai.module';
import { EmailModule } from './email/email.module';
import { ChatModule } from './chat/chat.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewModule } from './review/review.module';
import { DisputeModule } from './dispute/dispute.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { ReferralModule } from './referral/referral.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ContractModule } from './contract/contract.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UserStateModule } from './user-state/user-state.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    KycModule,
    GigModule,
    OrderModule,
    WalletModule,
    PaymentModule,
    CreditModule,
    JobModule,
    ApplicationModule,
    NotificationModule,
    AdminModule,
    McpModule,
    AiModule,
    EmailModule,
    ChatModule,
    DisputeModule,
    ReviewModule,
    ScheduleModule.forRoot(),
    AnalyticsModule,
    HealthModule,
    ReferralModule,
    NewsletterModule,
    ContractModule,
    SubscriptionModule,
    UserStateModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: BlockedUserGuard,
    },
  ],
})
export class AppModule { }
