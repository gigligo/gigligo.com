import { Controller, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { BoostService } from './boost.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/gigs')
@UseGuards(JwtAuthGuard)
export class BoostController {
    constructor(private readonly boostService: BoostService) { }

    @Post(':id/boost')
    boostGig(@Request() req: any, @Param('id') id: string, @Body('durationDays') durationDays: number) {
        return this.boostService.boostGig(req.user.id, id, durationDays || 3);
    }
}
