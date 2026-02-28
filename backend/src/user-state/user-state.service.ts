import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EntitlementService } from '../entitlement/entitlement.service';

@Injectable()
export class UserStateService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly entitlementService: EntitlementService
    ) { }

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

        // Dynamic Entitlements via EntitlementService
        const entitlements = await this.entitlementService.getUserEntitlements(user.id);

        return {
            accountStatus,
            kycStatus,
            subscriptionStatus,
            entitlements
        };
    }
}
