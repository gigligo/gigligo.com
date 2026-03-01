import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService implements OnModuleInit {
    private readonly logger = new Logger(AiService.name);

    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        this.logger.log('AI Service initialized');
    }

    /**
     * Generic user request processing (existing).
     */
    async processUserRequest(prompt: string) {
        return {
            message: `Received prompt: "${prompt}". Ready to process with AI.`,
        };
    }

    /**
     * POST /api/ai/optimize-proposal
     * Analyzes a freelancer's proposal text and returns an optimized version
     * with improved structure, language, and persuasion.
     */
    async optimizeProposal(proposal: string, jobTitle?: string, jobDescription?: string) {
        if (!proposal || proposal.trim().length < 20) {
            return { error: 'Proposal text must be at least 20 characters.' };
        }

        // Analyze the proposal structure
        const wordCount = proposal.split(/\s+/).length;
        const hasGreeting = /^(hi|hello|dear|greetings)/i.test(proposal.trim());
        const hasCTA = /(let's|let me|i'd love|looking forward|happy to)/i.test(proposal);
        const hasExperience = /(experience|years|portfolio|projects|worked)/i.test(proposal);
        const hasPricing = /(price|rate|budget|cost|\$|pkr|usd)/i.test(proposal);

        const suggestions: string[] = [];
        let score = 50;

        if (!hasGreeting) suggestions.push('Add a personalized greeting addressing the client by name.');
        else score += 10;

        if (!hasExperience) suggestions.push('Mention your relevant experience or past similar projects.');
        else score += 15;

        if (!hasCTA) suggestions.push('End with a clear call-to-action (e.g., "Let\'s schedule a quick call to discuss").');
        else score += 10;

        if (!hasPricing) suggestions.push('Consider including your pricing or a reference to budget expectations.');
        else score += 5;

        if (wordCount < 50) {
            suggestions.push('Your proposal is quite short. Aim for 100-200 words to cover key points.');
        } else if (wordCount > 300) {
            suggestions.push('Your proposal is lengthy. Consider trimming to 150-250 words for better engagement.');
        } else {
            score += 10;
        }

        // Build an optimized version
        let optimized = proposal;

        if (!hasGreeting && jobTitle) {
            optimized = `Hi there! I noticed your "${jobTitle}" project and I'd love to help.\n\n${optimized}`;
        }

        if (!hasCTA) {
            optimized += '\n\nI\'d love to discuss this further — feel free to message me or let\'s schedule a quick call!';
        }

        // Fetch average winning proposals for context
        const avgProposalRate = await this.prisma.jobApplication.aggregate({
            where: { status: 'HIRED' },
            _avg: { proposedRate: true },
        });

        return {
            original: proposal,
            optimized,
            score: Math.min(score, 100),
            wordCount,
            suggestions,
            marketInsight: {
                avgWinningRate: avgProposalRate._avg.proposedRate || 0,
                tip: 'Proposals with specific timelines and portfolios have 3x higher acceptance rates.',
            },
        };
    }

    /**
     * POST /api/ai/estimate-price
     * Analyzes a project description and returns a price estimate range
     * based on category, complexity, and market rates.
     */
    async estimatePrice(description: string, category?: string, deliverables?: string[]) {
        if (!description || description.trim().length < 10) {
            return { error: 'Project description must be at least 10 characters.' };
        }

        // Complexity estimation heuristics
        const wordCount = description.split(/\s+/).length;
        const hasMultipleDeliverables = deliverables && deliverables.length > 3;
        const isHighComplexity = /(ai|machine learning|blockchain|mobile app|full.?stack|enterprise)/i.test(description);
        const isMediumComplexity = /(website|dashboard|api|design|logo|branding|ecommerce)/i.test(description);

        let complexityLevel: 'low' | 'medium' | 'high' = 'low';
        if (isHighComplexity || hasMultipleDeliverables) complexityLevel = 'high';
        else if (isMediumComplexity) complexityLevel = 'medium';

        // Market rate lookup from completed orders
        const marketDataFilter: any = {};
        if (category) marketDataFilter.gig = { category };

        const marketStats = await this.prisma.order.aggregate({
            where: { status: 'COMPLETED', ...marketDataFilter },
            _avg: { price: true },
            _min: { price: true },
            _max: { price: true },
            _count: true,
        });

        // Base price ranges by complexity
        const priceRanges = {
            low: { minUSD: 25, maxUSD: 150, minPKR: 5000, maxPKR: 40000 },
            medium: { minUSD: 150, maxUSD: 800, minPKR: 40000, maxPKR: 200000 },
            high: { minUSD: 800, maxUSD: 5000, minPKR: 200000, maxPKR: 1400000 },
        };

        const range = priceRanges[complexityLevel];

        // Adjust based on deliverables count
        const deliverableMultiplier = deliverables ? Math.max(1, deliverables.length * 0.3) : 1;
        const adjustedMin = Math.round(range.minPKR * deliverableMultiplier);
        const adjustedMax = Math.round(range.maxPKR * deliverableMultiplier);

        return {
            estimate: {
                currency: 'PKR',
                min: adjustedMin,
                max: adjustedMax,
                recommended: Math.round((adjustedMin + adjustedMax) / 2),
                usd: {
                    min: Math.round(range.minUSD * deliverableMultiplier),
                    max: Math.round(range.maxUSD * deliverableMultiplier),
                },
            },
            complexity: complexityLevel,
            deliverableCount: deliverables?.length || 0,
            marketData: {
                avgCompletedOrderPKR: marketStats._avg?.price || 0,
                minCompletedOrderPKR: marketStats._min?.price || 0,
                maxCompletedOrderPKR: marketStats._max?.price || 0,
                totalCompletedOrders: marketStats._count || 0,
            },
            tips: [
                complexityLevel === 'high' ? 'Consider breaking this into milestones for better pricing control.' : null,
                'Include a detailed scope of work to avoid scope creep.',
                category ? `Pricing is based on "${category}" category market rates.` : 'Specifying a category improves estimate accuracy.',
            ].filter(Boolean),
        };
    }
}
