import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { CreditService } from './credit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/credits')
export class CreditController {
    constructor(private creditService: CreditService) { }

    @Get('packages')
    getPackages() {
        return this.creditService.getPackages();
    }

    @UseGuards(JwtAuthGuard)
    @Get('balance')
    getBalance(@Req() req: any) {
        return this.creditService.getBalance(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('purchase')
    purchaseCredits(@Req() req: any, @Body() body: { packageId: string }) {
        return this.creditService.purchaseCredits(req.user.id, body.packageId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('ledger')
    getLedger(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
        return this.creditService.getLedger(req.user.id, page ? +page : 1, limit ? +limit : 20);
    }
}
