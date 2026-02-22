import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AdminService, AdminAnalyticsService],
    controllers: [AdminController],
})
export class AdminModule { }
