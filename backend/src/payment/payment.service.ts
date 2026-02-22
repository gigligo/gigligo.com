import { Injectable, Logger } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private stripe: any = null;

    constructor(
        private walletService: WalletService,
        private prisma: PrismaService,
    ) {
        // Initialize Stripe only if API key is configured
        if (process.env.STRIPE_SECRET_KEY) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const Stripe = require('stripe');
                this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
                this.logger.log('✅ Stripe payment gateway initialized');
            } catch {
                this.logger.warn('Stripe SDK not found. Install with: npm install stripe');
            }
        } else {
            this.logger.warn('No STRIPE_SECRET_KEY — using mock payment gateway');
        }
    }

    // Initiate credit purchase checkout
    async createCreditCheckout(userId: string, packageId: string, method: string) {
        const pkg = await this.prisma.creditPackage.findUnique({ where: { id: packageId } });
        if (!pkg) throw new Error('Package not found');

        const mockTransactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // We route to our internal Mock Payment Gateway UI so the user can test the exact flow
        // without needing a Stripe or JazzCash API key configured locally.
        const paymentUrl = `${baseUrl}/checkout?txnId=${mockTransactionId}&amount=${pkg.pricePKR}&pkgId=${packageId}&userId=${userId}&method=${method}`;

        return {
            paymentUrl,
            mockTransactionId,
            amount: pkg.pricePKR,
            method,
        };
    }

    // Handle payment webhook callback
    async handleWebhook(data: any) {
        const { userId, amount, status, method, reference, packageId } = data;

        if (status === 'COMPLETED') {
            // First hit the Wallet to track the PKR transaction
            await this.walletService.addFunds(userId, parseFloat(amount));

            // If this was a credit package purchase, we must also award the credits
            if (packageId) {
                // To avoid circular dependency inject CreditService or handle it in the controller loop
                // Since CreditService might rely on Wallet, we can just do a direct Prisma update for the mock
                const pkg = await this.prisma.creditPackage.findUnique({ where: { id: packageId } });
                if (pkg) {
                    await this.prisma.$transaction(async (tx) => {
                        const user = await tx.user.update({
                            where: { id: userId },
                            data: { credits: { increment: pkg.credits } },
                        });

                        await tx.creditLedger.create({
                            data: {
                                userId,
                                amount: pkg.credits,
                                type: 'PURCHASE',
                                reason: `Purchased ${pkg.name} (${pkg.credits} credits) via ${method || 'Gateway'}`,
                                balanceAfter: user.credits,
                            },
                        });
                    });
                }
            }
        }
        return { received: true, status: 'PROCESSED' };
    }

    // Release payment to freelancer with commission deduction
    async releasePayment(freelancerId: string, grossAmount: number) {
        return this.walletService.addEarning(freelancerId, grossAmount);
    }
}
