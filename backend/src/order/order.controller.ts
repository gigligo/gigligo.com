import { Controller, Post, Param, Body, UseGuards, Request, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    createOrder(@Request() req: any, @Body() body: any) {
        return this.orderService.createOrder(req.user.id, body);
    }

    @Post(':id/deliver')
    submitDelivery(@Request() req: any, @Param('id') id: string, @Body('deliveryUrl') deliveryUrl: string) {
        return this.orderService.submitDelivery(req.user.id, id, deliveryUrl);
    }

    @Post(':id/confirm')
    confirmDelivery(@Request() req: any, @Param('id') id: string) {
        return this.orderService.confirmDelivery(req.user.id, id);
    }

    @Get('mine/purchases')
    getMyPurchases(@Request() req: any) {
        return this.orderService.getMyPurchases(req.user.id);
    }

    @Get('mine/sales')
    getMySales(@Request() req: any) {
        return this.orderService.getMySales(req.user.id);
    }
}
