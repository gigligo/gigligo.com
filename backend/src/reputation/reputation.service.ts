import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReputationService {
    private readonly logger = new Logger(ReputationService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Recalculate reputation scores for all users with reviews.
     * Runs every day at 2 AM to avoid peak traffic.
     */
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async recalculateAllScores() {
        this.logger.log('[Cron] Starting ReputationScore recalculation...');

        const usersWithReviews = await this.prisma.user.findMany({
            where: {
                reviewsRecvd: { some: {} },
            },
            select: { id: true },
        });

        const BATCH_SIZE = 50;
        let processed = 0;

        for (let i = 0; i < usersWithReviews.length; i += BATCH_SIZE) {
            const batch = usersWithReviews.slice(i, i + BATCH_SIZE);

            await Promise.all(batch.map(user => this.calculateScoreForUser(user.id)));
            processed += batch.length;
        }

        this.logger.log(`[Cron] Recalculated reputation for ${processed} users`);
    }

    /**
     * Calculate and upsert the reputation score for a single user.
     */
    async calculateScoreForUser(userId: string) {
        // Aggregate review stats
        const reviewStats = await this.prisma.review.aggregate({
            where: { revieweeId: userId },
            _avg: { rating: true },
            _count: { id: true },
        });

        // Calculate completion rate from orders
        const totalOrders = await this.prisma.order.count({
            where: { sellerId: userId, status: { in: ['COMPLETED', 'DELIVERED', 'DISPUTED', 'REFUNDED'] } },
        });

        const completedOrders = await this.prisma.order.count({
            where: { sellerId: userId, status: 'COMPLETED' },
        });

        // Also count completed contracts
        const totalContracts = await this.prisma.contract.count({
            where: { freelancerId: userId, status: { in: ['COMPLETED', 'CANCELLED', 'DISPUTED'] } },
        });

        const completedContracts = await this.prisma.contract.count({
            where: { freelancerId: userId, status: 'COMPLETED' },
        });

        const totalProjects = totalOrders + totalContracts;
        const completedProjects = completedOrders + completedContracts;
        const completionRate = totalProjects > 0 ? completedProjects / totalProjects : 0;

        // Count repeat clients (buyers who ordered more than once)
        const repeatClients = await this.prisma.order.groupBy({
            by: ['buyerId'],
            where: { sellerId: userId, status: 'COMPLETED' },
            having: { buyerId: { _count: { gt: 1 } } },
        });

        const avgRating = reviewStats._avg.rating || 0;
        const totalReviews = reviewStats._count.id;

        // Composite score: weighted formula
        // 40% rating + 25% completion + 20% volume + 15% repeat clients
        const volumeScore = Math.min(totalReviews / 50, 1); // normalize to 0-1 (50 reviews = max)
        const repeatScore = Math.min(repeatClients.length / 10, 1); // normalize to 0-1 (10 repeat = max)

        const overallScore = (
            (avgRating / 5) * 0.40 +
            completionRate * 0.25 +
            volumeScore * 0.20 +
            repeatScore * 0.15
        ) * 100; // Scale to 0-100

        await this.prisma.reputationScore.upsert({
            where: { userId },
            create: {
                userId,
                avgRating,
                totalReviews,
                completionRate,
                responseTime: 0, // TODO: calculate from message response times
                repeatClients: repeatClients.length,
                overallScore: Math.round(overallScore * 100) / 100,
                lastCalculatedAt: new Date(),
            },
            update: {
                avgRating,
                totalReviews,
                completionRate,
                repeatClients: repeatClients.length,
                overallScore: Math.round(overallScore * 100) / 100,
                lastCalculatedAt: new Date(),
            },
        });
    }

    /**
     * Get the reputation score for a user.
     */
    async getScore(userId: string) {
        let score = await this.prisma.reputationScore.findUnique({ where: { userId } });

        if (!score) {
            await this.calculateScoreForUser(userId);
            score = await this.prisma.reputationScore.findUnique({ where: { userId } });
        }

        return score;
    }
}
