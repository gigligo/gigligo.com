import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [
            totalUsers,
            totalSellers,
            totalEmployers,
            activeJobs,
            totalGigs,
            totalOrders,
            totalTransactions,
            totalEarnings,
            activeBoosts,
            totalOrderValue,
            pendingEscrow,
        ] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: { in: ['SELLER', 'STUDENT', 'FREE'] } } }),
            this.prisma.user.count({ where: { role: { in: ['EMPLOYER', 'BUYER'] } } }),
            this.prisma.job.count({ where: { status: 'OPEN' } }),
            this.prisma.gig.count(),
            this.prisma.order.count(),
            this.prisma.transaction.count(),
            this.prisma.transaction.aggregate({
                _sum: { amountPKR: true },
                where: { type: 'COMMISSION' }
            }),
            this.prisma.boost.count({ where: { expiresAt: { gt: new Date() } } }),
            this.prisma.order.aggregate({
                _sum: { escrowAmount: true },
                where: { status: 'COMPLETED' }
            }),
            this.prisma.wallet.aggregate({
                _sum: { pendingPKR: true }
            }),
        ]);

        return {
            totalUsers,
            totalSellers,
            totalEmployers,
            activeJobs,
            totalGigs,
            totalOrders,
            totalTransactions,
            platformRevenue: totalEarnings._sum.amountPKR || 0,
            activeBoosts,
            gmv: totalOrderValue._sum.escrowAmount || 0,
            escrowHeld: pendingEscrow._sum.pendingPKR || 0,
        };
    }

    async getRecentActivity() {
        const [recentUsers, recentJobs, recentTransactions] = await Promise.all([
            this.prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { profile: true }
            }),
            this.prisma.job.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { employer: { include: { profile: true } } }
            }),
            this.prisma.transaction.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { include: { profile: true } } }
            })
        ]);

        return { recentUsers, recentJobs, recentTransactions };
    }

    async getFoundingMemberStats() {
        const MAX_FOUNDING_FREELANCERS = 500;
        const MAX_FOUNDING_CLIENTS = 500;

        const [freelancerCount, clientCount] = await Promise.all([
            this.prisma.user.count({
                where: { isFoundingMember: true, role: { in: ['SELLER', 'STUDENT', 'FREE'] } }
            }),
            this.prisma.user.count({
                where: { isFoundingMember: true, role: { in: ['EMPLOYER', 'BUYER'] } }
            })
        ]);

        return {
            freelancers: {
                totalAwarded: freelancerCount,
                remainingSlots: Math.max(0, MAX_FOUNDING_FREELANCERS - freelancerCount)
            },
            clients: {
                totalAwarded: clientCount,
                remainingSlots: Math.max(0, MAX_FOUNDING_CLIENTS - clientCount)
            }
        };
    }

    async getPendingKyc() {
        return this.prisma.kYC.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        profile: { select: { fullName: true } }
                    }
                }
            },
            orderBy: { submittedAt: 'asc' }
        });
    }

    async decideKyc(kycId: string, status: 'APPROVED' | 'REJECTED') {
        const kycRecord = await this.prisma.kYC.findUnique({ where: { id: kycId } });
        if (!kycRecord) throw new Error('KYC Record not found');

        // Update the KYC Table
        const updatedKyc = await this.prisma.kYC.update({
            where: { id: kycId },
            data: { status }
        });

        // Update the User's `kycStatus` field so the global platform constraints know about the decision
        await this.prisma.user.update({
            where: { id: kycRecord.userId },
            data: { kycStatus: status }
        });

        return updatedKyc;
    }

    async addCreditsToUser(userId: string, amount: number, adminId: string) {
        if (amount <= 0) throw new Error('Amount must be greater than 0');

        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: { credits: { increment: amount } },
            });

            await tx.creditLedger.create({
                data: {
                    userId,
                    amount,
                    type: 'BONUS',
                    reason: `Manual addition by Admin (${adminId})`,
                    balanceAfter: user.credits,
                },
            });

            return { success: true, newBalance: user.credits };
        });
    }
}
