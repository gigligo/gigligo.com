import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardAnalytics(userId: string, role: string) {
        const isEmployer = role === 'EMPLOYER' || role === 'BUYER';
        const isFreelancer = role === 'SELLER' || role === 'FREE' || role === 'STUDENT';

        // Dates for comparison
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        let thisMonthEarnings = 0;
        let lastMonthEarnings = 0;
        let activeOrdersCount = 0;
        let totalMessagesCount = 0;

        if (isFreelancer) {
            // Seller Analytics
            const earningsThisMonth = await this.prisma.transaction.aggregate({
                _sum: { amountPKR: true },
                where: {
                    userId,
                    type: 'EARNING',
                    status: 'COMPLETED',
                    createdAt: { gte: firstDayThisMonth },
                },
            });

            const earningsLastMonth = await this.prisma.transaction.aggregate({
                _sum: { amountPKR: true },
                where: {
                    userId,
                    type: 'EARNING',
                    status: 'COMPLETED',
                    createdAt: { gte: firstDayLastMonth, lt: firstDayThisMonth },
                },
            });

            thisMonthEarnings = earningsThisMonth._sum.amountPKR || 0;
            lastMonthEarnings = earningsLastMonth._sum.amountPKR || 0;

            activeOrdersCount = await this.prisma.order.count({
                where: {
                    sellerId: userId,
                    status: { in: ['IN_PROGRESS', 'PENDING'] },
                },
            });
        }

        if (isEmployer) {
            // Employer Analytics (Spend instead of Earnings)
            const spendThisMonth = await this.prisma.transaction.aggregate({
                _sum: { amountPKR: true },
                where: {
                    userId,
                    type: 'PAYMENT',
                    status: 'COMPLETED',
                    createdAt: { gte: firstDayThisMonth },
                },
            });

            const spendLastMonth = await this.prisma.transaction.aggregate({
                _sum: { amountPKR: true },
                where: {
                    userId,
                    type: 'PAYMENT',
                    status: 'COMPLETED',
                    createdAt: { gte: firstDayLastMonth, lt: firstDayThisMonth },
                },
            });

            thisMonthEarnings = spendThisMonth._sum.amountPKR || 0; // Using this variable name for universal front-end mapping
            lastMonthEarnings = spendLastMonth._sum.amountPKR || 0;

            activeOrdersCount = await this.prisma.order.count({
                where: {
                    buyerId: userId,
                    status: { in: ['IN_PROGRESS', 'PENDING'] },
                },
            });
        }

        totalMessagesCount = await this.prisma.message.count({
            where: {
                conversation: {
                    OR: [
                        { freelancerId: userId },
                        { employerId: userId }
                    ]
                },
                isRead: false,
                senderId: { not: userId }
            }
        });

        const growthPercentage = lastMonthEarnings === 0
            ? 100
            : ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;

        return {
            financials: {
                current: thisMonthEarnings,
                previous: lastMonthEarnings,
                growth: Math.round(growthPercentage),
                label: isEmployer ? 'Total Spend' : 'Total Earnings'
            },
            activeOrders: activeOrdersCount,
            unreadMessages: totalMessagesCount
        };
    }
}
