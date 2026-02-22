import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DisputeService } from './dispute.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/disputes')
export class DisputeController {
    constructor(private readonly disputeService: DisputeService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createDispute(@Request() req: any, @Body() body: { orderId?: string; jobId?: string; reason: string }) {
        return this.disputeService.createDispute(req.user.id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMyDisputes(@Request() req: any) {
        return this.disputeService.getDisputes(req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('admin')
    getAdminDisputes() {
        return this.disputeService.getAdminDisputes();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('admin/:id/resolve')
    resolveDispute(
        @Request() req: any,
        @Param('id') id: string,
        @Body() body: { status: 'RESOLVED_BUYER' | 'RESOLVED_SELLER', resolution: string }
    ) {
        return this.disputeService.resolveDispute(req.user.id, id, body);
    }
}
