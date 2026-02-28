import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events, LowCreditsEvent } from '../events/event.dictionary';

@Injectable()
export class CreditService {
    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2
    ) { }

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

    async deductCredit(userId: string, reason: string, providedTx?: any) {
        const executeLogic = async (tx: any) => {
            // Atomic: decrement only if credits >= 1 (prevents race condition)
            let updated;
            try {
                updated = await tx.user.update({
                    where: { id: userId, credits: { gte: 1 } },
                    data: { credits: { decrement: 1 } },
                });
            } catch {
                // Prisma throws if the WHERE clause doesn't match any records
                throw new BadRequestException('Insufficient credits. Please purchase more credits to apply.');
            }

            await tx.creditLedger.create({
                data: {
                    userId,
                    amount: -1,
                    type: 'DEDUCTION',
                    reason,
                    balanceAfter: updated.credits,
                },
            });

            // Check if low credits -> notify via Event Bus
            if (updated.credits <= 3) {
                this.eventEmitter.emit(
                    Events.LOW_CREDITS,
                    new LowCreditsEvent(userId, updated.credits)
                );
            }

            return { credits: updated.credits };
        };

        return providedTx ? executeLogic(providedTx) : this.prisma.$transaction(executeLogic);
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
