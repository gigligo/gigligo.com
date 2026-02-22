import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('api/analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('freelancer')
    async getFreelancerStats(@Req() req: Request) {
        const user = req.user as any;
        return this.analyticsService.getFreelancerStats(user.userId, 30);
    }
}
