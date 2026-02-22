import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(private walletService: WalletService) { }

    @Get('balance')
    getBalance(@Req() req: any) {
        return this.walletService.getBalance(req.user.id);
    }

    @Post('checkout/stripe')
    createStripeCheckout(@Req() req: any, @Body() body: { amount: number }) {
        return this.walletService.createStripeCheckoutSession(req.user.id, body.amount);
    }

    @Post('withdraw')
    requestWithdrawal(@Req() req: any, @Body() body: { amount: number; method: string; twoFactorCode?: string }) {
        return this.walletService.requestWithdrawal(req.user.id, body.amount, body.method, body.twoFactorCode);
    }

    @Get('transactions')
    getTransactions(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
        return this.walletService.getTransactionHistory(req.user.id, page ? +page : 1, limit ? +limit : 20);
    }
}

// ----------------------------------------------------
// PUBLIC WEBHOOK CONTROLLER
// ----------------------------------------------------
import { Headers } from '@nestjs/common';

@Controller('api/webhooks')
export class WebhookController {
    constructor(private walletService: WalletService) { }

    @Post('stripe')
    async stripeWebhook(@Headers('stripe-signature') signature: string, @Body() payload: any) {
        return this.walletService.handleStripeWebhook(payload, signature);
    }
}
