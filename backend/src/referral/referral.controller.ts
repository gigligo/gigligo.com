import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/referral')
@UseGuards(JwtAuthGuard)
export class ReferralController {
    constructor(private readonly referralService: ReferralService) { }

    @Get('stats')
    getStats(@Request() req: any) {
        return this.referralService.getReferralStats(req.user.id);
    }

    @Post('generate-code')
    generateCode(@Request() req: any) {
        return this.referralService.generateReferralCode(req.user.id);
    }
}
