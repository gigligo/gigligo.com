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

    async updateChallenge(userId: string, currentChallenge: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { currentChallenge },
        });
    }

    async getWebAuthnCredential(credentialID: string) {
        return this.prisma.webAuthnCredential.findUnique({
            where: { credentialID },
            include: { user: true },
        });
    }

    async getUserCredentials(userId: string) {
        return this.prisma.webAuthnCredential.findMany({
            where: { userId },
        });
    }

    async saveWebAuthnCredential(userId: string, data: any) {
        return this.prisma.webAuthnCredential.create({
            data: {
                userId,
                credentialID: data.credentialID,
                credentialPublicKey: data.credentialPublicKey,
                counter: data.counter,
                credentialDeviceType: data.credentialDeviceType,
                credentialBackedUp: data.credentialBackedUp,
                transports: data.transports ? JSON.stringify(data.transports) : null,
            },
        });
    }

    async updateCredentialCounter(credentialID: string, counter: number | bigint) {
        return this.prisma.webAuthnCredential.update({
            where: { credentialID },
            data: { counter },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { profile: true, wallet: true },
        });
    }

    // --- WebAuthn Autofill Challenges ---

    async saveAuthChallenge(challenge: string, expiresAt: Date) {
        return this.prisma.authChallenge.create({
            data: { challenge, expiresAt },
        });
    }

    async getAuthChallenge(id: string) {
        return this.prisma.authChallenge.findUnique({
            where: { id },
        });
    }

    async deleteAuthChallenge(id: string) {
        return this.prisma.authChallenge.delete({
            where: { id },
        }).catch(() => null); // Ignore if already deleted
    }

    async create(data: { email: string; passwordHash?: string | null; googleId?: string; fullName: string; role?: string; phone?: string; nationalId?: string; kycStatus?: any; termsAcceptedAt?: Date }) {
        const assignedRole = (data.role as any) || 'FREE';

        // 1. Determine if this user qualifies for the First 500 Founding Member rewards
        let isFoundingMember = false;
        let foundingMemberType = null;
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
        });
    }

    async updateRole(userId: string, role: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: role as any },
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
}
