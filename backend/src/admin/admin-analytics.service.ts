import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminAnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getPlatformOverview(days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // User growth over time
        const users = await this.prisma.user.findMany({
            where: { createdAt: { gte: startDate } },
            select: { createdAt: true, role: true },
            orderBy: { createdAt: 'asc' },
        });

        const userGrowth: Record<string, { date: string; total: number; sellers: number; employers: number }> = {};
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            userGrowth[dateStr] = { date: dateStr, total: 0, sellers: 0, employers: 0 };
        }
        for (const u of users) {
            const dateStr = u.createdAt.toISOString().split('T')[0];
            if (userGrowth[dateStr]) {
                userGrowth[dateStr].total++;
                if (u.role === 'SELLER' || u.role === 'STUDENT' || u.role === 'FREE') {
                    userGrowth[dateStr].sellers++;
                } else if (u.role === 'EMPLOYER') {
                    userGrowth[dateStr].employers++;
                }
            }
        }

        // Revenue trends (completed orders)
        const orders = await this.prisma.order.findMany({
            where: { status: 'COMPLETED', updatedAt: { gte: startDate } },
            select: { price: true, updatedAt: true },
        });

        const revenueTrend: Record<string, { date: string; revenue: number; orders: number }> = {};
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            revenueTrend[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
        }
        for (const o of orders) {
            const dateStr = o.updatedAt.toISOString().split('T')[0];
            if (revenueTrend[dateStr]) {
                revenueTrend[dateStr].revenue += o.price;
                revenueTrend[dateStr].orders++;
            }
        }

        // Top categories by gig count
        const categoryData = await this.prisma.gig.groupBy({
            by: ['category'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 8,
        });
        const topCategories = categoryData.map(c => ({
            category: c.category,
            count: c._count.id,
        }));

        // Conversion funnel
        const totalUsers = await this.prisma.user.count();
        const verifiedUsers = await this.prisma.user.count({ where: { kycStatus: 'APPROVED' } });
        const usersWithOrders = await this.prisma.order.findMany({
            distinct: ['buyerId'],
            select: { buyerId: true },
        });
        const usersWithCompletedOrders = await this.prisma.order.findMany({
            where: { status: 'COMPLETED' },
            distinct: ['buyerId'],
            select: { buyerId: true },
        });

        const funnel = [
            { stage: 'Registered', count: totalUsers },
            { stage: 'KYC Verified', count: verifiedUsers },
            { stage: 'Placed Order', count: usersWithOrders.length },
            { stage: 'Completed Order', count: usersWithCompletedOrders.length },
        ];

        return {
            userGrowth: Object.values(userGrowth),
            revenueTrend: Object.values(revenueTrend),
            topCategories,
            funnel,
        };
    }
}
