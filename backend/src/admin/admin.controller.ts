import { Controller, Get, Post, Body, UseGuards, Req, Param, Query } from '@nestjs/common';
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
    async decideKyc(@Req() req: any, @Body() body: { kycId: string; status: 'APPROVED' | 'REJECTED' }) {
        return this.adminService.decideKyc(body.kycId, body.status, req.user.id);
    }

    @Get('analytics')
    async getAnalytics() {
        return this.analyticsService.getPlatformOverview();
    }

    @Post('users/:userId/credits')
    async addCredits(
        @Req() req: any,
        @Param('userId') targetUserId: string,
        @Body() body: { amount: number }
    ) {
        return this.adminService.addCreditsToUser(targetUserId, body.amount, req.user.id);
    }

    @Post('users/:userId/suspend')
    async suspendUser(@Req() req: any, @Param('userId') userId: string) {
        return this.adminService.suspendUser(userId, req.user.id);
    }

    @Get('audit-logs')
    async getAuditLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
        return this.adminService.getAuditLogs(page ? +page : 1, limit ? +limit : 50);
    }
}
