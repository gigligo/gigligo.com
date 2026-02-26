import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService, private walletService: WalletService) { }

    async createOrder(buyerId: string, data: { gigId: string; packageSelected: 'STARTER' | 'STANDARD' | 'PREMIUM'; price: number; escrowAmount: number; deadline: Date }) {
        const gig = await this.prisma.gig.findUnique({ where: { id: data.gigId } });
        if (!gig) throw new NotFoundException('Gig not found');
        if (gig.sellerId === buyerId) throw new BadRequestException('Cannot order your own gig');

        return this.prisma.$transaction(async (tx) => {
            // Atomic: verify buyer has funds and deduct
            let buyerWallet;
            try {
                buyerWallet = await tx.wallet.update({
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

            return tx.order.create({
                data: {
                    ...data,
                    buyerId,
                    sellerId: gig.sellerId,
                    status: 'PENDING',
                },
            });
        });
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
        const result = await this.walletService.addEarning(order.sellerId, order.escrowAmount, true);

        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'COMPLETED',
                escrowReleased: true,
                commission: result.commission,
            },
        });
    }

    async submitDelivery(sellerId: string, orderId: string, deliveryUrl: string) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order || order.sellerId !== sellerId) {
            throw new NotFoundException('Order not found or unauthorized');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'DELIVERED',
                deliveryUrl,
            },
        });
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
