import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getFreelancerStats(sellerId: string, days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        // Fetch completed orders
        const orders = await this.prisma.order.findMany({
            where: {
                sellerId,
                status: 'COMPLETED',
                updatedAt: { gte: startDate }
            },
            select: {
                price: true,
                updatedAt: true,
            }
        });

        // Fetch job applications
        const applications = await this.prisma.jobApplication.findMany({
            where: {
                freelancerId: sellerId,
                appliedAt: { gte: startDate }
            },
            select: {
                appliedAt: true
            }
        });

        // Aggregate by date (YYYY-MM-DD)
        const dailyData: Record<string, { date: string; earnings: number; orders: number; applications: number }> = {};

        // Initialize last X days with 0s to ensure a continuous line chart
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            dailyData[dateStr] = { date: dateStr, earnings: 0, orders: 0, applications: 0 };
        }

        // Aggregate Orders
        for (const order of orders) {
            const dateStr = order.updatedAt.toISOString().split('T')[0];
            if (dailyData[dateStr]) {
                dailyData[dateStr].earnings += order.price;
                dailyData[dateStr].orders += 1;
            }
        }

        // Aggregate Applications
        for (const app of applications) {
            const dateStr = app.appliedAt.toISOString().split('T')[0];
            if (dailyData[dateStr]) {
                dailyData[dateStr].applications += 1;
            }
        }

        // Convert the record to an array sorted by date
        return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
    }
}
