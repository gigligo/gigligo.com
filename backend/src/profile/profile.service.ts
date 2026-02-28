import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        let profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: {
                user: { select: { email: true, role: true, createdAt: true, isFoundingMember: true, kycStatus: true, paymentVerified: true } },
                experiences: { orderBy: { startDate: 'desc' } },
                educations: { orderBy: { startYear: 'desc' } },
                portfolioItems: { orderBy: { createdAt: 'desc' } }
            },
        });

        if (!profile) {
            // Auto-create a minimal profile if the user accesses it for the first time
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) throw new NotFoundException('User not found');

            profile = await this.prisma.profile.create({
                data: {
                    userId: user.id,
                    fullName: user.email.split('@')[0], // Default placeholder name
                },
                include: {
                    user: { select: { email: true, role: true, createdAt: true, isFoundingMember: true, kycStatus: true, paymentVerified: true } },
                    experiences: true,
                    educations: true,
                    portfolioItems: true
                }
            });
        }
        return profile;
    }

    async getPublicProfile(profileId: string) {
        let profile = await this.prisma.profile.findFirst({
            where: {
                OR: [
                    { id: profileId },
                    { userId: profileId }
                ]
            },
            include: {
                user: { select: { id: true, role: true, createdAt: true, isFoundingMember: true, kycStatus: true, paymentVerified: true } },
                experiences: { orderBy: { startDate: 'desc' } },
                educations: { orderBy: { startYear: 'desc' } },
                portfolioItems: { orderBy: { createdAt: 'desc' } }
            },
        });

        // If no full profile exists, try to return basic user info
        if (!profile) {
            const user = await this.prisma.user.findUnique({
                where: { id: profileId },
                select: { id: true, email: true, role: true, createdAt: true, isFoundingMember: true, kycStatus: true, paymentVerified: true }
            });
            if (!user) throw new NotFoundException('Profile not found');

            // Return a mock profile wrapper around the user
            return {
                id: 'draft',
                userId: user.id,
                fullName: 'Anonymous User',
                user: user,
                experiences: [],
                educations: [],
                portfolioItems: [],
            };
        }

        return profile;
    }

    async updateProfile(userId: string, data: any) {
        // Mass assignment protection — only allow whitelisted fields
        const allowedFields = [
            'fullName', 'bio', 'avatarUrl', 'title', 'skills', 'hourlyRate',
            'phone', 'city', 'country', 'languages', 'website', 'linkedin',
            'github', 'twitter', 'university', 'department', 'graduationYear',
        ];
        const safeData: Record<string, any> = {};
        for (const key of allowedFields) {
            if (data[key] !== undefined) {
                safeData[key] = data[key];
            }
        }

        // Must use upsert in case the profile row doesn't exist yet
        return this.prisma.profile.upsert({
            where: { userId },
            create: { userId, fullName: safeData.fullName || 'User', ...safeData },
            update: safeData,
        });
    }

    // Experience
    async addExperience(userId: string, data: any) {
        const profile = await this.getProfile(userId);
        return this.prisma.experience.create({
            data: { ...data, profileId: profile.id }
        });
    }

    async updateExperience(userId: string, id: string, data: any) {
        const profile = await this.getProfile(userId);
        return this.prisma.experience.update({
            where: { id, profileId: profile.id },
            data
        });
    }

    async deleteExperience(userId: string, id: string) {
        const profile = await this.getProfile(userId);
        return this.prisma.experience.delete({
            where: { id, profileId: profile.id }
        });
    }

    // Education
    async addEducation(userId: string, data: any) {
        const profile = await this.getProfile(userId);
        return this.prisma.education.create({
            data: { ...data, profileId: profile.id }
        });
    }

    async updateEducation(userId: string, id: string, data: any) {
        const profile = await this.getProfile(userId);
        return this.prisma.education.update({
            where: { id, profileId: profile.id },
            data
        });
    }

    async deleteEducation(userId: string, id: string) {
        const profile = await this.getProfile(userId);
        return this.prisma.education.delete({
            where: { id, profileId: profile.id }
        });
    }

    // Portfolio
    async addPortfolioItem(userId: string, data: any) {
        const profile = await this.getProfile(userId);
        return this.prisma.portfolioItem.create({
            data: { ...data, profileId: profile.id }
        });
    }

    async updatePortfolioItem(userId: string, id: string, data: any) {
        const profile = await this.getProfile(userId);
        return this.prisma.portfolioItem.update({
            where: { id, profileId: profile.id },
            data
        });
    }

    async deletePortfolioItem(userId: string, id: string) {
        const profile = await this.getProfile(userId);
        return this.prisma.portfolioItem.delete({
            where: { id, profileId: profile.id }
        });
    }
}
