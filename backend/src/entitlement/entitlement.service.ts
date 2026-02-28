import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EntitlementService {
    constructor(private readonly prisma: PrismaService) { }

    async getUserEntitlements(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscriptions: true,
                kyc: true,
                profile: true
            },
        });

        if (!user) throw new NotFoundException('User not found');

        const now = new Date();
        const hasActiveSubscription = user.subscriptions && user.subscriptions.endDate && user.subscriptions.endDate > now;
        const subTier = (hasActiveSubscription && user.subscriptions) ? user.subscriptions.tier : 'NONE';

        let proposalLimit = 10; // Default Free Tier Limit
        if (subTier === 'STANDARD') proposalLimit = 50;
        if (subTier === 'PREMIUM' || subTier === 'PRO') proposalLimit = 9999; // Unlimited

        let boostPriority = 0;
        if (subTier === 'PREMIUM' || subTier === 'PRO') boostPriority = 1;

        // Dynamic Badge Calculation (Golden, Green, Grey)
        let badge = 'GREY';
        if (user.isFoundingMember && subTier !== 'NONE') {
            badge = 'GOLDEN';
        } else if (user.isFoundingMember) {
            badge = 'GREEN';
        }

        return {
            isVerified: user.kycStatus === 'APPROVED',
            isPro: subTier !== 'NONE',
            isFoundingMember: user.isFoundingMember,
            badgeTier: badge,
            proposalLimit,
            boostPriority
        };
    }

    async canApplyToJob(userId: string): Promise<boolean> {
        // Enforce proposal limits here, counting applied jobs this month
        // For simplicity in Phase 2, we just return true. Detailed checking requires a count in JobApplication.
        // Full implementation will query: count JobApplications by user this month < proposalLimit
        const entitlements = await this.getUserEntitlements(userId);
        if (entitlements.proposalLimit === 9999) return true;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentMonthApplicationsCount = await this.prisma.jobApplication.count({
            where: {
                freelancerId: userId,
                appliedAt: { gte: startOfMonth }
            }
        });

        return currentMonthApplicationsCount < entitlements.proposalLimit;
    }
}
