import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService, private walletService: WalletService) { }

    async createOrder(buyerId: string, data: { gigId: string; packageSelected: 'STARTER' | 'STANDARD' | 'PREMIUM'; price: number; escrowAmount: number; deadline: Date }) {
        const gig = await this.prisma.gig.findUnique({ where: { id: data.gigId } });
        if (!gig) throw new NotFoundException('Gig not found');

        // Mock payment intent success by moving funds to Escrow directly
        // We'll increment the seller's pendingPKR to simulate escrow
        await this.prisma.wallet.upsert({
            where: { userId: gig.sellerId },
            create: { userId: gig.sellerId, balancePKR: 0, pendingPKR: data.escrowAmount },
            update: { pendingPKR: { increment: data.escrowAmount } }
        });

        return this.prisma.order.create({
            data: {
                ...data,
                buyerId,
                sellerId: gig.sellerId,
                status: 'PENDING',
            },
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
