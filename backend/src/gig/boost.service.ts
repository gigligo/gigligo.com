import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class BoostService {
    constructor(private prisma: PrismaService, private walletService: WalletService) { }

    async boostGig(sellerId: string, gigId: string, durationDays: number) {
        // Package-based pricing
        const packages: Record<number, number> = { 7: 500, 30: 1500 };
        const totalCost = packages[durationDays];
        if (!totalCost) {
            throw new BadRequestException('Invalid boost duration. Choose 7 days (PKR 500) or 30 days (PKR 1,500).');
        }

        const gig = await this.prisma.gig.findUnique({ where: { id: gigId } });
        if (!gig || gig.sellerId !== sellerId) {
            throw new NotFoundException('Gig not found or unauthorized');
        }

        // Atomic: deduct wallet and create boost in single transaction
        await this.prisma.$transaction(async (tx) => {
            // Atomic balance check + deduction (prevents race condition)
            let wallet;
            try {
                wallet = await tx.wallet.update({
                    where: { userId: sellerId, balancePKR: { gte: totalCost } },
                    data: { balancePKR: { decrement: totalCost } },
                });
            } catch {
                throw new BadRequestException(`Insufficient balance to boost gig. Required: PKR ${totalCost}`);
            }

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
