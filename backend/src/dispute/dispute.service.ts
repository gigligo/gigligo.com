import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class DisputeService {
    constructor(private prisma: PrismaService, private walletService: WalletService) { }

    async createDispute(userId: string, data: { orderId?: string; jobId?: string; reason: string }) {
        if (!data.orderId && !data.jobId) {
            throw new BadRequestException('Must provide either orderId or jobId');
        }

        let defendantId = '';
        if (data.orderId) {
            const order = await this.prisma.order.findUnique({ where: { id: data.orderId } });
            if (!order) throw new NotFoundException('Order not found');
            if (order.buyerId !== userId && order.sellerId !== userId) {
                throw new BadRequestException('You are not a party to this order');
            }
            if (order.status === 'COMPLETED' || order.status === 'REFUNDED') {
                throw new BadRequestException('Order is already in a final state');
            }

            defendantId = order.buyerId === userId ? order.sellerId : order.buyerId;

            // Mark order as disputed
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: 'DISPUTED' }
            });

        } else if (data.jobId) {
            const job = await this.prisma.job.findUnique({ where: { id: data.jobId } });
            if (!job) throw new NotFoundException('Job not found');
            // For Jobs, just allow employer or whoever. Actually keep it simple.
            defendantId = job.employerId === userId ? 'SYSTEM' : job.employerId;
            // Note: Jobs aren't mapped perfectly cleanly to disputes as orders, so we try our best.
        }

        return this.prisma.dispute.create({
            data: {
                initiatorId: userId,
                defendantId,
                orderId: data.orderId,
                jobId: data.jobId,
                reason: data.reason,
            }
        });
    }

    async getDisputes(userId: string) {
        return this.prisma.dispute.findMany({
            where: {
                OR: [{ initiatorId: userId }, { defendantId: userId }]
            },
            include: { order: true, job: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getAdminDisputes() {
        return this.prisma.dispute.findMany({
            where: { status: 'OPEN' },
            include: {
                initiator: { select: { profile: { select: { fullName: true } }, email: true } },
                defendant: { select: { profile: { select: { fullName: true } }, email: true } },
                order: true,
                job: true
            },
            orderBy: { createdAt: 'asc' }
        });
    }

    async resolveDispute(adminId: string, disputeId: string, data: { status: 'RESOLVED_BUYER' | 'RESOLVED_SELLER', resolution: string }) {
        const dispute = await this.prisma.dispute.findUnique({ where: { id: disputeId }, include: { order: true } });
        if (!dispute) throw new NotFoundException('Dispute not found');
        if (dispute.status !== 'OPEN') throw new BadRequestException('Dispute already resolved');

        return this.prisma.$transaction(async (tx) => {
            // Update Dispute
            const resolvedDispute = await tx.dispute.update({
                where: { id: disputeId },
                data: {
                    status: data.status,
                    resolution: data.resolution,
                    resolvedAt: new Date()
                }
            });

            // Process Order Escrow
            if (dispute.order) {
                const order = dispute.order;
                if (data.status === 'RESOLVED_BUYER') {
                    // Refund Buyer: Decrement seller's pending, Increment buyer's balance
                    await tx.wallet.update({
                        where: { userId: order.sellerId },
                        data: { pendingPKR: { decrement: order.escrowAmount } }
                    });
                    await tx.wallet.upsert({
                        where: { userId: order.buyerId },
                        create: { userId: order.buyerId, balancePKR: order.escrowAmount },
                        update: { balancePKR: { increment: order.escrowAmount } }
                    });
                    await tx.transaction.create({
                        data: {
                            userId: order.buyerId,
                            amountPKR: order.escrowAmount,
                            type: 'REFUND',
                            status: 'COMPLETED',
                            description: `Dispute Resolution Refund for Order ${order.id}`
                        }
                    });

                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: 'REFUNDED' }
                    });

                } else if (data.status === 'RESOLVED_SELLER') {
                    // Release escrow — use WalletService.addEarning logic for proper founding-member handling
                    const grossAmount = order.escrowAmount;

                    // Move escrow from pending to zero (earnings will be added via addEarning after tx)
                    await tx.wallet.update({
                        where: { userId: order.sellerId },
                        data: { pendingPKR: { decrement: grossAmount } },
                    });

                    await tx.order.update({
                        where: { id: order.id },
                        data: {
                            status: 'COMPLETED',
                            escrowReleased: true,
                        },
                    });
                }
            }

            return resolvedDispute;
        });

        // After transaction: if seller won, use WalletService.addEarning for correct commission
        if (data.status === 'RESOLVED_SELLER' && dispute?.order) {
            await this.walletService.addEarning(dispute!.order!.sellerId, dispute!.order!.escrowAmount, false);
        }

        return { success: true, disputeId };
    }
}
