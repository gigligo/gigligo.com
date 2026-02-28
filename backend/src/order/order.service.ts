import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events, OrderCreatedEvent, OrderDeliveredEvent, OrderCompletedEvent } from '../events/event.dictionary';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private walletService: WalletService,
        private eventEmitter: EventEmitter2
    ) { }

    async createOrder(buyerId: string, data: { gigId: string; packageSelected: 'STARTER' | 'STANDARD' | 'PREMIUM'; price: number; escrowAmount: number; deadline: Date }) {
        const gig = await this.prisma.gig.findUnique({ where: { id: data.gigId } });
        if (!gig) throw new NotFoundException('Gig not found');
        if (gig.sellerId === buyerId) throw new BadRequestException('Cannot order your own gig');

        const txResult = await this.prisma.$transaction(async (tx) => {
            // Atomic: verify buyer has funds and deduct
            try {
                // Must use `tx` here to enlist in the transaction
                await tx.wallet.update({
                    where: { userId: buyerId, balancePKR: { gte: data.escrowAmount } },
                    data: { balancePKR: { decrement: data.escrowAmount } },
                });
            } catch {
                throw new BadRequestException(`Insufficient wallet balance. Required: PKR ${data.escrowAmount}. Please add funds.`);
            }

            // Credit escrow to seller's pendingPKR
            await tx.wallet.upsert({
                where: { userId: gig.sellerId },
                create: { userId: gig.sellerId, balancePKR: 0, pendingPKR: data.escrowAmount },
                update: { pendingPKR: { increment: data.escrowAmount } }
            });

            // Log Transaction for Buyer Deduction
            await tx.transaction.create({
                data: {
                    userId: buyerId,
                    amountPKR: data.escrowAmount,
                    type: 'PAYMENT',       // FIXED IDE Error: Changed to valid TxType enum
                    status: 'COMPLETED',
                    description: `Escrow funded for Gig order: ${gig.title}`,
                }
            });

            const newOrder = await tx.order.create({
                data: {
                    ...data,
                    buyerId,
                    sellerId: gig.sellerId,
                    status: 'PENDING',
                },
            });

            return { newOrder, gigTitle: gig.title };
        });

        // Fire & Forget decoupled event
        this.eventEmitter.emit(
            Events.ORDER_CREATED,
            new OrderCreatedEvent(txResult.newOrder.id, txResult.gigTitle, buyerId, gig.sellerId)
        );

        return txResult.newOrder;
    }

    async confirmDelivery(buyerId: string, orderId: string) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order || order.buyerId !== buyerId) {
            throw new NotFoundException('Order not found or unauthorized');
        }
        if (order.status !== 'DELIVERED') {
            throw new BadRequestException('Order is not in delivered status yet');
        }

        // Release escrow logic
        // This dynamically calculates commission (0% for founding members' first 3 projects, 10% otherwise)
        const result = await this.walletService.addEarning(order.sellerId, order.escrowAmount, true, order.id);

        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'COMPLETED',
                escrowReleased: true,
                commission: result.commission,
            },
            include: { gig: { select: { title: true } } }
        });

        this.eventEmitter.emit(
            Events.ORDER_COMPLETED,
            new OrderCompletedEvent(updated.id, updated.gig.title, updated.buyerId, updated.sellerId, order.escrowAmount)
        );

        return updated;
    }

    async submitDelivery(sellerId: string, orderId: string, deliveryUrl: string) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order || order.sellerId !== sellerId) {
            throw new NotFoundException('Order not found or unauthorized');
        }
        const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'DELIVERED',
                deliveryUrl,
            },
            include: { gig: { select: { title: true } } }
        });

        this.eventEmitter.emit(
            Events.ORDER_DELIVERED,
            new OrderDeliveredEvent(updated.id, updated.gig.title, updated.buyerId, updated.sellerId)
        );

        return updated;
    }

    async getMyPurchases(buyerId: string) {
        return this.prisma.order.findMany({
            where: { buyerId },
            include: { gig: true, seller: { select: { profile: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getMySales(sellerId: string) {
        return this.prisma.order.findMany({
            where: { sellerId },
            include: { gig: true, buyer: { select: { profile: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
}
