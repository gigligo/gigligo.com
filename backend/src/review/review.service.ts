import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReviewService {
    private readonly logger = new Logger(ReviewService.name);
    constructor(private prisma: PrismaService) { }

    async submitReview(
        buyerId: string,
        data: { orderId: string; rating: number; comment: string }
    ) {
        if (data.rating < 1 || data.rating > 5) {
            throw new BadRequestException('Rating must be between 1 and 5');
        }

        const order = await this.prisma.order.findUnique({
            where: { id: data.orderId },
            include: { gig: true }
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.buyerId !== buyerId) throw new ForbiddenException('You are not the buyer of this order');
        if (order.status !== 'COMPLETED') throw new BadRequestException('You can only review completed orders');

        // Check if already reviewed
        const existing = await this.prisma.review.findFirst({
            where: { reviewerId: buyerId, gigId: order.gigId }
        });
        if (existing) throw new BadRequestException('You have already reviewed this order');

        // Create the review
        const review = await this.prisma.review.create({
            data: {
                reviewerId: buyerId,
                revieweeId: order.sellerId,
                gigId: order.gigId,
                rating: data.rating,
                comment: data.comment,
            }
        });

        // Update the order with buyer rating snapshot
        await this.prisma.order.update({
            where: { id: order.id },
            data: { buyerRating: data.rating, buyerReview: data.comment }
        });

        // Immediately recalculate seller level after new review
        await this.recalculateSellerLevel(order.sellerId);

        return review;
    }

    async getGigReviews(gigId: string) {
        return this.prisma.review.findMany({
            where: { gigId },
            include: {
                reviewer: {
                    select: {
                        profile: { select: { fullName: true, avatarUrl: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getSellerReviews(sellerId: string) {
        return this.prisma.review.findMany({
            where: { revieweeId: sellerId },
            include: {
                reviewer: {
                    select: {
                        profile: { select: { fullName: true, avatarUrl: true } }
                    }
                },
                gig: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async recalculateSellerLevel(sellerId: string) {
        const [reviews, completedOrders] = await Promise.all([
            this.prisma.review.findMany({ where: { revieweeId: sellerId }, select: { rating: true } }),
            this.prisma.order.count({ where: { sellerId, status: 'COMPLETED' } })
        ]);

        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        let level: 'NEW' | 'LEVEL_1' | 'LEVEL_2' | 'TOP_RATED' = 'NEW';
        if (completedOrders >= 50 && avgRating >= 4.7) {
            level = 'TOP_RATED';
        } else if (completedOrders >= 20 && avgRating >= 4.5) {
            level = 'LEVEL_2';
        } else if (completedOrders >= 5 && avgRating >= 4.0) {
            level = 'LEVEL_1';
        }

        await this.prisma.profile.updateMany({
            where: { userId: sellerId },
            data: { sellerLevel: level } as any
        });

        return { level, avgRating, completedOrders };
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async recalculateAllLevels() {
        const sellers = await this.prisma.user.findMany({
            where: { role: { in: ['SELLER', 'STUDENT'] } },
            select: { id: true }
        });
        await Promise.all(sellers.map(s => this.recalculateSellerLevel(s.id)));
        this.logger.log(`[Cron] Recalculated levels for ${sellers.length} sellers`);
    }
}
