import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class BoostService {
    constructor(private prisma: PrismaService, private walletService: WalletService) { }

    async boostGig(sellerId: string, gigId: string, durationDays: number) {
        // Flat rate per day for boosting
        const pricePerDay = 500;
        const totalCost = pricePerDay * durationDays;

        const gig = await this.prisma.gig.findUnique({ where: { id: gigId } });
        if (!gig || gig.sellerId !== sellerId) {
            throw new NotFoundException('Gig not found or unauthorized');
        }

        const wallet = await this.walletService.getBalance(sellerId);
        if (wallet.balancePKR < totalCost) {
            throw new BadRequestException(`Insufficient balance to boost gig. Required: PKR ${totalCost}`);
        }

        // Deduct from wallet
        await this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { userId: sellerId },
                data: { balancePKR: { decrement: totalCost } },
            });

            await tx.transaction.create({
                data: {
                    userId: sellerId,
                    amountPKR: totalCost,
                    type: 'BOOST',
                    status: 'COMPLETED',
                    description: `Boosted Gig for ${durationDays} days`,
                },
            });

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + durationDays);

            await tx.boost.create({
                data: {
                    gigId,
                    amountPKR: totalCost,
                    expiresAt,
                },
            });
        });

        return { message: 'Gig boosted successfully', totalCost };
    }
}
