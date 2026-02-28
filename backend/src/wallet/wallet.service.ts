import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TwoFactorService } from '../auth/twoFactor.service';
import Stripe from 'stripe';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events, PaymentReceivedEvent } from '../events/event.dictionary';

@Injectable()
export class WalletService {
    private stripe: Stripe;

    constructor(
        private prisma: PrismaService,
        private twoFactorService: TwoFactorService,
        private eventEmitter: EventEmitter2
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

    async handleStripeWebhook(rawBody: Buffer, signature: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new BadRequestException('Stripe webhook secret not configured');
        }

        let event: any;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch (err: any) {
            throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            if (session.metadata?.type === 'WALLET_DEPOSIT') {
                const userId = session.client_reference_id;
                const amountPKR = parseInt(session.metadata.amountPKR, 10);

                // Idempotency: check if this session was already processed
                const existing = await this.prisma.transaction.findFirst({
                    where: { reference: session.id, status: 'COMPLETED' },
                });
                if (existing) {
                    return { received: true, message: 'Already processed' };
                }

                // Add funds to the user's wallet
                if (userId && amountPKR) {
                    await this.addFunds(userId, amountPKR);

                    // Log the transaction with session ID for idempotency
                    await this.prisma.transaction.create({
                        data: {
                            userId,
                            amountPKR,
                            type: 'EARNING',
                            status: 'COMPLETED',
                            method: 'BANK_TRANSFER',
                            reference: session.id,
                            description: 'Stripe Wallet Deposit',
                        }
                    });
                }
            }
        }
        return { received: true };
    }

    async addEarning(userId: string, grossAmount: number, fromEscrow: boolean = false, orderId?: string) {
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
            this.eventEmitter.emit(
                Events.PAYMENT_RECEIVED,
                new PaymentReceivedEvent(userId, netAmount, 'Gig Order', commission, grossAmount)
            );

            // Add commission to platform admin wallet if > 0
            if (commission > 0) {
                await this.addCommission(tx, commission, userId, 'Earning Deduction', orderId);
            }

            return { wallet, commission, netAmount, grossAmount };
        });
    }

    async addCommission(tx: any, amount: number, sourceId: string, description: string, orderId?: string) {
        // Find the platform admin user to credit commission
        const adminUser = await tx.user.findFirst({ where: { role: 'ADMIN' } });
        if (!adminUser) {
            // Log warning but don't crash — commission tracking via transaction records is sufficient
            console.warn('No ADMIN user found for commission. Commission logged in transactions but not credited to a wallet.');
            return;
        }

        await tx.wallet.upsert({
            where: { userId: adminUser.id },
            create: { userId: adminUser.id, balancePKR: amount, pendingPKR: 0 },
            update: { balancePKR: { increment: amount } },
        });

        await tx.transaction.create({
            data: {
                userId: adminUser.id,
                amountPKR: amount,
                type: 'COMMISSION',
                status: 'COMPLETED',
                description: `Platform fee collected from ${sourceId}: ${description}`,
            },
        });

        await tx.platformRevenue.create({
            data: {
                amountPKR: amount,
                reason: description,
                orderId: orderId || null
            }
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

        // Atomic withdrawal: check balance and deduct inside transaction
        return this.prisma.$transaction(async (tx) => {
            let wallet;
            try {
                wallet = await tx.wallet.update({
                    where: { userId, balancePKR: { gte: amount } },
                    data: {
                        balancePKR: { decrement: amount },
                        pendingPKR: { increment: amount },
                    },
                });
            } catch {
                throw new BadRequestException(`Insufficient balance for withdrawal of PKR ${amount}`);
            }

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
