import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { profile: true, wallet: true },
        });
    }

    async create(data: { email: string; passwordHash?: string | null; googleId?: string; fullName: string; role?: string; phone?: string; nationalId?: string; kycStatus?: any; termsAcceptedAt?: Date }) {
        const assignedRole = (data.role as any) || 'FREE';

        // 1. Determine if this user qualifies for the First 500 Founding Member rewards
        let isFoundingMember = false;
        let foundingMemberType: string | null = null;
        let initialCredits = 0;

        // Grouping for the 500 limit:
        // Freelancers & Students belong to one bucket
        // Employers/Buyers belong to another bucket
        if (['SELLER', 'STUDENT', 'FREE'].includes(assignedRole)) {
            const freelancerCount = await this.prisma.user.count({
                where: { role: { in: ['SELLER', 'STUDENT', 'FREE'] } }
            });
            if (freelancerCount < 500) {
                isFoundingMember = true;
                foundingMemberType = assignedRole === 'STUDENT' ? 'Graduate' : 'Freelancer';
                initialCredits = 25; // 25 Free bonus credits for first 500 freelancers/students
            }
        } else if (['EMPLOYER', 'BUYER'].includes(assignedRole)) {
            const clientCount = await this.prisma.user.count({
                where: { role: { in: ['EMPLOYER', 'BUYER'] } }
            });
            if (clientCount < 500) {
                isFoundingMember = true;
                foundingMemberType = 'Client';
                // Clients don't use application credits currently, but get 0% service fee for first 3 jobs
            }
        }

        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    passwordHash: (data.passwordHash || null) as any,
                    googleId: data.googleId || null,
                    role: assignedRole,
                    phone: data.phone,
                    credits: initialCredits,
                    isFoundingMember,
                    nationalId: data.nationalId,
                    kycStatus: data.kycStatus || 'UNVERIFIED',
                    termsAcceptedAt: data.termsAcceptedAt,
                    profile: {
                        create: {
                            fullName: data.fullName,
                            foundingMemberType,
                        },
                    },
                    wallet: {
                        create: {
                            balancePKR: 0,
                            pendingPKR: 0,
                        },
                    },
                },
                include: {
                    profile: true,
                    wallet: true,
                },
            });

            // Log the initial 30 bonus credits in the ledger if awarded
            if (initialCredits > 0) {
                await tx.creditLedger.create({
                    data: {
                        userId: user.id,
                        amount: initialCredits,
                        type: 'BONUS',
                        reason: 'Founding Member Registration Bonus',
                        balanceAfter: initialCredits
                    }
                });
            }

            return user;
        }, { timeout: 15000 });
    }

    async updateRole(userId: string, role: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: role as any },
        });
    }

    async updatePassword(userId: string, passwordHash: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    }

    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                include: { profile: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count(),
        ]);
        return { items: items.map(u => { const { passwordHash, ...rest } = u; return rest; }), total, page, limit };
    }

    // ═══════════════════════════════════════
    // REFRESH TOKEN MANAGEMENT
    // ═══════════════════════════════════════

    async storeRefreshToken(userId: string, token: string, expiresInDays: number = 7) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        return this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            }
        });
    }

    async findRefreshToken(token: string) {
        return this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true }
        });
    }

    async revokeRefreshToken(token: string) {
        return this.prisma.refreshToken.update({
            where: { token },
            data: { isRevoked: true }
        });
    }

    async revokeAllUserRefreshTokens(userId: string) {
        return this.prisma.refreshToken.updateMany({
            where: { userId },
            data: { isRevoked: true }
        });
    }
}
