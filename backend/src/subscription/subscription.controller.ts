import { Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/subscription')
export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) { }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    async getStatus(@Req() req: any) {
        return this.subscriptionService.getStatus(req.user.id);
    }

    @Post('subscribe')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SELLER', 'STUDENT', 'FREE')
    async subscribe(@Req() req: any) {
        return this.subscriptionService.subscribe(req.user.id);
    }
}
