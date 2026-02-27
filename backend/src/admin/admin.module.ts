import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [PrismaModule, EmailModule, NotificationModule],
    providers: [AdminService, AdminAnalyticsService],
    controllers: [AdminController],
})
export class AdminModule { }
