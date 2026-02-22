import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ReferralService {
    private readonly logger = new Logger(ReferralService.name);

    constructor(private prisma: PrismaService) { }

    /** Generate a unique referral code for a user */
    async generateReferralCode(userId: string): Promise<string> {
        const existing = await this.prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
        if (existing?.referralCode) return existing.referralCode;

        const code = randomBytes(4).toString('hex').toUpperCase(); // 8 chars like "A1B2C3D4"
        await this.prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
        return code;
    }

    /** Get referral stats for a user */
    async getReferralStats(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { referralCode: true },
        });

        const referrals = await this.prisma.referral.findMany({
            where: { referrerId: userId },
            include: { referee: { select: { id: true, email: true, createdAt: true, profile: { select: { fullName: true } } } } },
            orderBy: { createdAt: 'desc' },
        });

        const totalBonus = referrals.reduce((sum, r) => sum + r.bonusGiven, 0);

        return {
            referralCode: user?.referralCode,
            referralLink: `https://gigligo.com/register?ref=${user?.referralCode}`,
            totalReferrals: referrals.length,
            totalBonusCredits: totalBonus,
            referrals: referrals.map(r => ({
                id: r.id,
                name: r.referee.profile?.fullName || r.referee.email,
                bonusGiven: r.bonusGiven,
                joinedAt: r.createdAt,
            })),
        };
    }

    /** Process a referral when a new user registers with a referral code */
    async processReferral(newUserId: string, referralCode: string) {
        const referrer = await this.prisma.user.findUnique({ where: { referralCode } });
        if (!referrer) {
            this.logger.warn(`Invalid referral code: ${referralCode}`);
            return null;
        }

        // Don't allow self-referral
        if (referrer.id === newUserId) return null;

        // Check if already referred
        const existing = await this.prisma.referral.findUnique({
            where: { referrerId_refereeId: { referrerId: referrer.id, refereeId: newUserId } },
        });
        if (existing) return null;

        const BONUS_CREDITS = 10;

        // Create referral record and award credits to BOTH users
        const [referral] = await this.prisma.$transaction([
            this.prisma.referral.create({
                data: { referrerId: referrer.id, refereeId: newUserId, bonusGiven: BONUS_CREDITS },
            }),
            this.prisma.user.update({
                where: { id: referrer.id },
                data: { credits: { increment: BONUS_CREDITS }, referredById: undefined },
            }),
            this.prisma.user.update({
                where: { id: newUserId },
                data: { credits: { increment: BONUS_CREDITS }, referredById: referrer.id },
            }),
        ]);

        this.logger.log(`Referral processed: ${referrer.id} → ${newUserId} (+${BONUS_CREDITS} credits each)`);
        return referral;
    }
}
