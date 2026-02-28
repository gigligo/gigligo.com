import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('dashboard')
    async getDashboardAnalytics(@Req() req: any) {
        return this.analyticsService.getDashboardAnalytics(req.user.id, req.user.role);
    }
}
