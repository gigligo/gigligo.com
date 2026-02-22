import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletService } from '../wallet/wallet.service';

@Controller('api/payments')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly walletService: WalletService
    ) { }


    @Post('webhook')
    webhook(@Body() body: any) {
        // This would be hit by JazzCash/EasyPaisa
        return this.paymentService.handleWebhook(body);
    }
}
