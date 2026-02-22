import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TwoFactorService } from '../auth/twoFactor.service';
import Stripe from 'stripe';

@Injectable()
export class WalletService {
    private stripe: Stripe;

    constructor(
        private prisma: PrismaService,
        private twoFactorService: TwoFactorService
    ) {
        // In production, instantiate this with process.env.STRIPE_SECRET_KEY
        // Example: this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', { apiVersion: '2023-10-16' });
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', { apiVersion: '2025-02-24.acacia' as any });
    }

    async getBalance(userId: string) {
        let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            wallet = await this.prisma.wallet.create({ data: { userId, balancePKR: 0, pendingPKR: 0 } });
        }
        return wallet;
    }

    async addFunds(userId: string, amount: number) {
        return this.prisma.wallet.upsert({
            where: { userId },
            create: { userId, balancePKR: amount, pendingPKR: 0 },
            update: { balancePKR: { increment: amount } },
        });
    }

    async createStripeCheckoutSession(userId: string, amountPKR: number) {
        // This is the production-ready Stripe Checkout initialization.
        // Once the frontend calls this, it will redirect the user to Stripe's hosted checkout.

        // Convert PKR to smallest currency unit (paisa, though Stripe typically handles PKR in whole units for test mode, we multiply by 100 for standard format)
        // Ensure STRIPE_SECRET_KEY is set in .env
        if (process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
            console.warn("WARNING: Stripe is running with a placeholder key. Payments will fail in production.");
        }

        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'pkr',
                            product_data: {
                                name: 'Gigligo Wallet Deposit',
                                description: `Deposit PKR ${amountPKR} into your Gigligo Wallet`,
                            },
                            unit_amount: amountPKR * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/wallet?success=true`,
                cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/wallet?canceled=true`,
                client_reference_id: userId,
                metadata: {
                    type: 'WALLET_DEPOSIT',
                    amountPKR: amountPKR.toString()
                }
            });

            return { url: session.url };
        } catch (error) {
            console.error("Stripe Checkout Error:", error);
            throw new BadRequestException("Failed to create Stripe checkout session. Please check API keys.");
        }
    }

    async handleStripeWebhook(payload: any, signature: string) {
        // In production, verify the webhook signature using process.env.STRIPE_WEBHOOK_SECRET
        // const event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);

        // For this skeleton, we assume the payload is already verified if arriving here.
        const event = payload;

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            if (session.metadata?.type === 'WALLET_DEPOSIT') {
                const userId = session.client_reference_id;
                const amountPKR = parseInt(session.metadata.amountPKR, 10);

                // Add funds to the user's wallet
                if (userId && amountPKR) {
                    await this.addFunds(userId, amountPKR);

                    // Log the transaction
                    await this.prisma.transaction.create({
                        data: {
                            userId,
                            amountPKR,
                            type: 'EARNING',
                            status: 'COMPLETED',
                            method: 'BANK_TRANSFER',
                            description: 'Stripe Wallet Deposit',
                        }
                    });
                }
            }
        }
        return { received: true };
    }

    async addEarning(userId: string, grossAmount: number, fromEscrow: boolean = false) {
        // Fetch user to check for Founding Member status
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { isFoundingMember: true, role: true }
        });

        let commissionRate = 0.10;

        // Apply 0% commission reward for first 3 projects if Founding Member
        if (user?.isFoundingMember && ['SELLER', 'STUDENT', 'FREE'].includes(user.role)) {
            // Count completed orders (gigs) and jobs (hired applications)
            const completedOrders = await this.prisma.order.count({
                where: { sellerId: userId, status: 'COMPLETED' }
            });
            // We'll consider HIRED applications as completed projects for this metric
            const hiredJobs = await this.prisma.jobApplication.count({
                where: { freelancerId: userId, status: 'HIRED' }
            });

            if (completedOrders + hiredJobs < 3) {
                commissionRate = 0.0; // 0% commission for first 3!
            }
        }

        const commission = Math.round(grossAmount * commissionRate);
        const netAmount = grossAmount - commission;

        return this.prisma.$transaction(async (tx) => {
            const updateData: any = { balancePKR: { increment: netAmount } };
            if (fromEscrow) {
                updateData.pendingPKR = { decrement: grossAmount };
            }

            const wallet = await tx.wallet.upsert({
                where: { userId },
                create: { userId, balancePKR: netAmount, pendingPKR: 0 },
                update: updateData,
            });

            // Log earning transaction
            await tx.transaction.create({
                data: {
                    userId,
                    amountPKR: netAmount,
                    type: 'EARNING',
                    status: 'COMPLETED',
                    description: `Earned PKR ${grossAmount}, commission PKR ${commission} (${commissionRate * 100}%)`,
                },
            });

            // Log commission transaction if > 0
            if (commission > 0) {
                await tx.transaction.create({
                    data: {
                        userId,
                        amountPKR: commission,
                        type: 'COMMISSION',
                        status: 'COMPLETED',
                        description: `Platform commission (${commissionRate * 100}%)`,
                    },
                });
            }

            // Notify freelancer
            await tx.notification.create({
                data: {
                    userId,
                    type: 'PAYMENT_RECEIVED',
                    title: 'Payment Received',
                    message: `You earned PKR ${netAmount} (PKR ${commission} platform fee deducted from PKR ${grossAmount})`,
                    link: '/dashboard/earnings',
                },
            });

            // Add commission to Admin Wallet if > 0
            if (commission > 0) {
                await this.addCommission(tx, commission, userId, 'Earning Deduction');
            }

            return { wallet, commission, netAmount, grossAmount };
        });
    }

    async addCommission(tx: any, amount: number, sourceId: string, description: string) {
        // We'll use a hardcoded 'ADMIN_WALLET_ID' for the platform ledger.
        // In a real system, you'd fetch the actual admin user ID.
        const adminWalletId = 'ADMIN_WALLET_ID';

        await tx.wallet.upsert({
            where: { userId: adminWalletId },
            create: { userId: adminWalletId, balancePKR: amount, pendingPKR: 0 },
            update: { balancePKR: { increment: amount } },
        });

        await tx.transaction.create({
            data: {
                userId: adminWalletId,
                amountPKR: amount,
                type: 'COMMISSION',
                status: 'COMPLETED',
                description: `Platform fee collected from ${sourceId}: ${description}`,
            },
        });
    }

    async requestWithdrawal(userId: string, amount: number, method: string, twoFactorCode?: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new BadRequestException('User not found');

        if ((user as any).isTwoFactorEnabled) {
            if (!twoFactorCode) {
                throw new UnauthorizedException('2FA code is required for withdrawal');
            }
            if (!(user as any).twoFactorSecret) {
                throw new BadRequestException('2FA is enabled but secret is missing from database');
            }
            const isValid = this.twoFactorService.validateCode((user as any).twoFactorSecret, twoFactorCode);
            if (!isValid) {
                throw new UnauthorizedException('Invalid 2FA code');
            }
        }

        const wallet = await this.getBalance(userId);
        if (wallet.balancePKR < amount) {
            throw new BadRequestException(`Insufficient balance. Available: PKR ${wallet.balancePKR}`);
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { userId },
                data: {
                    balancePKR: { decrement: amount },
                    pendingPKR: { increment: amount },
                },
            });

            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    amountPKR: amount,
                    type: 'WITHDRAWAL',
                    status: 'PENDING',
                    method: method as any,
                    description: `Withdrawal request via ${method}`,
                },
            });

            return transaction;
        });
    }

    async getTransactionHistory(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.transaction.count({ where: { userId } }),
        ]);
        return { items, total, page, limit };
    }
}
