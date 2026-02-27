import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
        private notificationService: NotificationService,
    ) { }

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

    async decideKyc(kycId: string, status: 'APPROVED' | 'REJECTED', adminId: string) {
        const kycRecord = await this.prisma.kYC.findUnique({ where: { id: kycId } });
        if (!kycRecord) throw new Error('KYC Record not found');

        const updatedKyc = await this.prisma.$transaction(async (tx) => {
            // Update the KYC Table
            const updated = await tx.kYC.update({
                where: { id: kycId },
                data: { status, reviewedAt: new Date(), reviewerId: adminId }
            });

            // Update the User's kycStatus
            await tx.user.update({
                where: { id: kycRecord.userId },
                data: { kycStatus: status }
            });

            // Audit log
            await tx.auditLog.create({
                data: {
                    adminId,
                    action: `KYC_${status}`,
                    targetId: kycRecord.userId,
                    details: `KYC ${status.toLowerCase()} for user ${kycRecord.userId}`,
                },
            });

            return updated;
        });

        // ── Post-transaction: Send email + in-app notification (fire-and-forget) ──
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: kycRecord.userId },
                include: { profile: { select: { fullName: true } } },
            });

            if (user) {
                const fullName = user.profile?.fullName || 'User';

                // Email notification
                if (status === 'APPROVED') {
                    this.emailService.sendKycApprovedEmail(user.email, fullName).catch(e =>
                        this.logger.error(`Failed to send KYC approved email to ${user.email}`, e)
                    );
                } else {
                    this.emailService.sendKycRejectedEmail(user.email, fullName).catch(e =>
                        this.logger.error(`Failed to send KYC rejected email to ${user.email}`, e)
                    );
                }

                // In-app notification
                this.notificationService.create(user.id, {
                    type: 'SYSTEM',
                    title: status === 'APPROVED' ? 'KYC Approved ✅' : 'KYC Rejected ⚠️',
                    message: status === 'APPROVED'
                        ? 'Your identity has been verified. You now have full access to the platform.'
                        : 'Your verification was not approved. Please re-submit clear, valid documents.',
                    link: status === 'APPROVED' ? '/dashboard' : '/dashboard/kyc',
                }).catch(e =>
                    this.logger.error(`Failed to create KYC notification for user ${user.id}`, e)
                );
            }
        } catch (e) {
            this.logger.error(`Post-KYC notification error`, e);
        }

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

            // Audit log
            await tx.auditLog.create({
                data: {
                    adminId,
                    action: 'CREDIT_ADJUSTMENT',
                    targetId: userId,
                    details: `Added ${amount} credits to user ${userId}. New balance: ${user.credits}`,
                },
            });

            return { success: true, newBalance: user.credits };
        });
    }

    async suspendUser(userId: string, adminId: string) {
        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { isSuspended: true },
            });

            await tx.auditLog.create({
                data: {
                    adminId,
                    action: 'USER_SUSPENDED',
                    targetId: userId,
                    details: `User ${userId} suspended by admin ${adminId}`,
                },
            });
        });

        return { success: true, message: 'User suspended' };
    }

    async getAuditLogs(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                include: { admin: { select: { email: true, profile: { select: { fullName: true } } } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.auditLog.count(),
        ]);
        return { items, total, page, limit };
    }
}
