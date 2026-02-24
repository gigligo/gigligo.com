import { Controller, Post, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { ContractService } from './contract.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KycGuard } from '../auth/kyc.guard';

@Controller('api/contracts')
@UseGuards(JwtAuthGuard, KycGuard)
export class ContractController {
    constructor(private contractService: ContractService) { }

    /**
     * POST /api/contracts/accept/:applicationId
     * Employer accepts a proposal → creates a contract.
     */
    @Post('accept/:applicationId')
    async acceptApplication(@Req() req: any, @Param('applicationId') applicationId: string) {
        return this.contractService.createFromApplication(req.user.id, applicationId);
    }

    /**
     * PATCH /api/contracts/:id/complete
     * Employer marks a contract as completed.
     */
    @Patch(':id/complete')
    async completeContract(@Req() req: any, @Param('id') id: string) {
        return this.contractService.completeContract(req.user.id, id);
    }

    /**
     * GET /api/contracts
     * Get all contracts for the current user.
     */
    @Get()
    async getMyContracts(@Req() req: any) {
        return this.contractService.getMyContracts(req.user.id);
    }

    /**
     * GET /api/contracts/:id
     * Get a single contract by ID.
     */
    @Get(':id')
    async getContract(@Req() req: any, @Param('id') id: string) {
        return this.contractService.getContract(req.user.id, id);
    }
}
