import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

const PRO_PRICE_PKR = 1500;
const PRO_DURATION_DAYS = 30;

@Injectable()
export class SubscriptionService {
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleExpiredSubscriptions() {
        this.logger.log('Checking for expired subscriptions...');
        const now = new Date();

        const expiredSubs = await this.prisma.subscription.findMany({
            where: {
                tier: 'PRO',
                endDate: { lt: now }
            }
        });

        if (expiredSubs.length > 0) {
            for (const sub of expiredSubs) {
                await this.prisma.$transaction(async (tx) => {
                    // Downgrade subscription tier
                    await tx.subscription.update({
                        where: { id: sub.id },
                        data: { tier: 'FREE' }
                    });

                    // Notify user of downgrade
                    await tx.notification.create({
                        data: {
                            userId: sub.userId,
                            type: 'SYSTEM',
                            title: 'Pro Plan Expired',
                            message: 'Your Pro Plan subscription has expired. You have been downgraded to the Free tier. Renew now to regain premium benefits.',
                            link: '/dashboard',
                        }
                    });
                });
                this.logger.log(`Downgraded user ${sub.userId} to FREE due to subscription expiry.`);
            }
            this.logger.log(`Processed ${expiredSubs.length} expired subscriptions.`);
        }
    }

    async getStatus(userId: string) {
        const sub = await this.prisma.subscription.findUnique({ where: { userId } });
        if (!sub || !sub.endDate) return { isActive: false, tier: null, expiresAt: null };

        const isActive = sub.endDate > new Date();
        return {
            isActive,
            tier: isActive ? sub.tier : null,
            expiresAt: sub.endDate,
            daysRemaining: isActive ? Math.ceil((sub.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
        };
    }

    async isProMember(userId: string): Promise<boolean> {
        const sub = await this.prisma.subscription.findUnique({ where: { userId } });
        if (!sub || !sub.endDate) return false;
        return sub.endDate > new Date();
    }

    async subscribe(userId: string) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + PRO_DURATION_DAYS);

        return this.prisma.$transaction(async (tx) => {
            // Atomic: deduct only if wallet has sufficient balance (prevents race condition)
            let wallet;
            try {
                wallet = await tx.wallet.update({
                    where: { userId, balancePKR: { gte: PRO_PRICE_PKR } },
                    data: { balancePKR: { decrement: PRO_PRICE_PKR } },
                });
            } catch {
                throw new BadRequestException(`Insufficient wallet balance. Pro Plan costs PKR ${PRO_PRICE_PKR}. Please add funds first.`);
            }

            // Log transaction with proper type
            await tx.transaction.create({
                data: {
                    userId,
                    amountPKR: PRO_PRICE_PKR,
                    type: 'SUBSCRIPTION',
                    status: 'COMPLETED',
                    description: `Pro Plan Subscription (${PRO_DURATION_DAYS} days)`,
                },
            });

            // Upsert subscription (renew if existing)
            const subscription = await tx.subscription.upsert({
                where: { userId },
                create: {
                    userId,
                    tier: 'PRO',
                    startDate,
                    endDate,
                },
                update: {
                    tier: 'PRO',
                    startDate,
                    endDate,
                },
            });

            // Notify user
            await tx.notification.create({
                data: {
                    userId,
                    type: 'SUBSCRIPTION_ACTIVATED',
                    title: 'Pro Plan Activated! 🎉',
                    message: `Your Pro Plan is now active until ${endDate.toLocaleDateString()}. Enjoy priority gig ranking and increased proposal limits!`,
                    link: '/dashboard',
                },
            });

            return {
                success: true,
                subscription,
                message: `Pro Plan activated for ${PRO_DURATION_DAYS} days`,
            };
        });
    }

    async adminOverride(userId: string, days: number, adminId: string) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);

        return this.prisma.$transaction(async (tx) => {
            const subscription = await tx.subscription.upsert({
                where: { userId },
                create: { userId, tier: 'PRO', startDate: new Date(), endDate },
                update: { tier: 'PRO', startDate: new Date(), endDate },
            });

            await tx.auditLog.create({
                data: {
                    userId: adminId,
                    action: 'SUBSCRIPTION_OVERRIDE',
                    targetId: userId,
                    details: `Granted ${days} days of PRO access to user ${userId}`,
                },
            });

            return { success: true, subscription, overriddenBy: adminId };
        });
    }
}
