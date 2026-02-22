import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditService {
    constructor(private prisma: PrismaService) { }

    async getPackages() {
        return this.prisma.creditPackage.findMany({
            where: { isActive: true },
            orderBy: { pricePKR: 'asc' },
        });
    }

    async getBalance(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        });
        return { credits: user?.credits || 0 };
    }

    async purchaseCredits(userId: string, packageId: string) {
        const pkg = await this.prisma.creditPackage.findUnique({ where: { id: packageId } });
        if (!pkg || !pkg.isActive) throw new NotFoundException('Credit package not found');

        // In production, this would be called after payment confirmation
        return this.prisma.$transaction(async (tx) => {
            // Add credits to user
            const user = await tx.user.update({
                where: { id: userId },
                data: { credits: { increment: pkg.credits } },
            });

            // Log to credit ledger
            await tx.creditLedger.create({
                data: {
                    userId,
                    amount: pkg.credits,
                    type: 'PURCHASE',
                    reason: `Purchased ${pkg.name} (${pkg.credits} credits)`,
                    balanceAfter: user.credits,
                },
            });

            // Log transaction
            await tx.transaction.create({
                data: {
                    userId,
                    amountPKR: pkg.pricePKR,
                    type: 'CREDIT_PURCHASE',
                    status: 'COMPLETED',
                    description: `Credit purchase: ${pkg.name}`,
                },
            });

            return { credits: user.credits, purchased: pkg.credits };
        });
    }

    async deductCredit(userId: string, reason: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        });
        if (!user || user.credits < 1) {
            throw new BadRequestException('Insufficient credits. Please purchase more credits to apply.');
        }

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.user.update({
                where: { id: userId },
                data: { credits: { decrement: 1 } },
            });

            await tx.creditLedger.create({
                data: {
                    userId,
                    amount: -1,
                    type: 'DEDUCTION',
                    reason,
                    balanceAfter: updated.credits,
                },
            });

            // Check if low credits -> notify
            if (updated.credits <= 3) {
                await tx.notification.create({
                    data: {
                        userId,
                        type: 'LOW_CREDITS',
                        title: 'Low Credits',
                        message: `You have ${updated.credits} credits remaining. Purchase more to keep applying.`,
                        link: '/dashboard/credits',
                    },
                });
            }

            return { credits: updated.credits };
        });
    }

    async refundCredit(userId: string, reason: string) {
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: { credits: { increment: 1 } },
            });

            await tx.creditLedger.create({
                data: {
                    userId,
                    amount: 1,
                    type: 'REFUND',
                    reason,
                    balanceAfter: user.credits,
                },
            });

            return { credits: user.credits };
        });
    }

    async getLedger(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.creditLedger.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.creditLedger.count({ where: { userId } }),
        ]);
        return { items, total, page, limit };
    }
}
