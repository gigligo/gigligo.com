import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserStateService {
    constructor(private readonly prisma: PrismaService) { }

    async getUserState(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscriptions: true,
                kyc: true,
            },
        });

        if (!user) throw new NotFoundException('User not found');

        // Account Status logic
        let accountStatus = 'ACTIVE';
        if (user.isSuspended) {
            accountStatus = 'SUSPENDED';
        }
        // TODO: define 'BLOCKED' - maybe based on Role or a specific flag

        // Subscription Status
        let subscriptionStatus = 'NONE';
        const sub = user.subscriptions;
        if (sub) {
            const now = new Date();
            if (sub.endDate && sub.endDate < now) {
                subscriptionStatus = 'EXPIRED';
            } else {
                subscriptionStatus = 'ACTIVE';
            }
        }

        // KYC Status
        let kycStatus = 'NOT_SUBMITTED';
        if (user.kycStatus) kycStatus = user.kycStatus;

        // Entitlements
        // TODO: Move these deeper calculation to Phase 2 (Entitlement Engine) if needed, but keeping basic for now.
        let proposalLimit = 10; // Default Free
        if (subscriptionStatus === 'ACTIVE') {
            if (sub?.tier === 'STANDARD') proposalLimit = 50;
            if (sub?.tier === 'PREMIUM' || sub?.tier === 'PRO') proposalLimit = 9999;
        }

        let boostPriority = 0;
        if (subscriptionStatus === 'ACTIVE' && (sub?.tier === 'PREMIUM' || sub?.tier === 'PRO')) {
            boostPriority = 1;
        }

        return {
            accountStatus,
            kycStatus,
            subscriptionStatus,
            entitlements: {
                isPro: subscriptionStatus === 'ACTIVE',
                isVerified: kycStatus === 'APPROVED',
                isFoundingMember: user.isFoundingMember,
                proposalLimit,
                boostPriority,
            },
        };
    }
}
