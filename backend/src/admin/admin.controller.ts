import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAnalyticsService } from './admin-analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(
        private adminService: AdminService,
        private analyticsService: AdminAnalyticsService,
    ) { }

    @Get('stats')
    async getStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('activity')
    async getActivity() {
        return this.adminService.getRecentActivity();
    }

    @Get('founders')
    async getFounderStats() {
        return this.adminService.getFoundingMemberStats();
    }

    @Get('kyc/pending')
    async getPendingKyc() {
        return this.adminService.getPendingKyc();
    }

    @Post('kyc/decide')
    async decideKyc(@Body() body: { kycId: string; status: 'APPROVED' | 'REJECTED' }) {
        return this.adminService.decideKyc(body.kycId, body.status);
    }

    @Get('analytics')
    async getAnalytics() {
        return this.analyticsService.getPlatformOverview();
    }
}
