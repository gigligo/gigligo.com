import { Module } from '@nestjs/common';
import { LocalPaymentGatewayService } from './local-payment-gateway.service';

@Module({
  providers: [LocalPaymentGatewayService],
  exports: [LocalPaymentGatewayService],
})
export class PaymentModule { }
