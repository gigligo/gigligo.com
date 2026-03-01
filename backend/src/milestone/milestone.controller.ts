import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KycGuard } from '../auth/kyc.guard';

@Controller('api/milestones')
@UseGuards(JwtAuthGuard, KycGuard)
export class MilestoneController {
    constructor(private milestoneService: MilestoneService) { }

    /**
     * POST /api/milestones/:contractId
     * Create milestones for a contract (Employer only).
     */
    @Post(':contractId')
    async createMilestones(
        @Req() req: any,
        @Param('contractId') contractId: string,
        @Body() body: { milestones: { description: string; amount: number }[] },
    ) {
        return this.milestoneService.createMilestones(req.user.id, contractId, body.milestones);
    }

    /**
     * GET /api/milestones/:contractId
     * Get all milestones for a contract.
     */
    @Get(':contractId')
    async getMilestones(@Req() req: any, @Param('contractId') contractId: string) {
        return this.milestoneService.getMilestones(req.user.id, contractId);
    }

    /**
     * PATCH /api/milestones/:id/fund
     * Fund a milestone into escrow (Employer).
     */
    @Patch(':id/fund')
    async fundMilestone(@Req() req: any, @Param('id') id: string) {
        return this.milestoneService.fundMilestone(req.user.id, id);
    }

    /**
     * PATCH /api/milestones/:id/submit
     * Submit work for a milestone (Freelancer).
     */
    @Patch(':id/submit')
    async submitWork(@Req() req: any, @Param('id') id: string) {
        return this.milestoneService.submitWork(req.user.id, id);
    }

    /**
     * PATCH /api/milestones/:id/approve
     * Approve submitted work (Employer).
     */
    @Patch(':id/approve')
    async approveWork(@Req() req: any, @Param('id') id: string) {
        return this.milestoneService.approveWork(req.user.id, id);
    }

    /**
     * PATCH /api/milestones/:id/release
     * Release escrow funds to freelancer (Employer).
     */
    @Patch(':id/release')
    async releaseFunds(@Req() req: any, @Param('id') id: string) {
        return this.milestoneService.releaseFunds(req.user.id, id);
    }
}
