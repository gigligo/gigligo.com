import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/reputation')
export class ReputationController {
    constructor(private reputationService: ReputationService) { }

    /**
     * GET /api/reputation/:userId
     * Get the reputation score for a user (public).
     */
    @Get(':userId')
    async getScore(@Param('userId') userId: string) {
        return this.reputationService.getScore(userId);
    }
}
