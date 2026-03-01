import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('process')
    async processRequest(@Body('prompt') prompt: string) {
        return this.aiService.processUserRequest(prompt);
    }

    /**
     * POST /api/ai/optimize-proposal
     * Takes a freelancer's proposal draft and returns an optimized version
     * with improved language, structure, and persuasiveness.
     */
    @Post('optimize-proposal')
    async optimizeProposal(
        @Req() req: any,
        @Body() body: { proposal: string; jobTitle?: string; jobDescription?: string },
    ) {
        return this.aiService.optimizeProposal(body.proposal, body.jobTitle, body.jobDescription);
    }

    /**
     * POST /api/ai/estimate-price
     * Takes a project description and returns a price estimate range
     * based on market data, complexity, and deliverables.
     */
    @Post('estimate-price')
    async estimatePrice(
        @Req() req: any,
        @Body() body: { description: string; category?: string; deliverables?: string[] },
    ) {
        return this.aiService.estimatePrice(body.description, body.category, body.deliverables);
    }
}
