import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: {
                user: { select: { email: true, role: true, createdAt: true } },
                experiences: { orderBy: { startDate: 'desc' } },
                educations: { orderBy: { startYear: 'desc' } },
                portfolioItems: { orderBy: { createdAt: 'desc' } }
            },
        });
        if (!profile) throw new NotFoundException('Profile not found');
        return profile;
    }

    async getPublicProfile(profileId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
            include: {
                user: { select: { id: true, role: true, createdAt: true } },
                experiences: { orderBy: { startDate: 'desc' } },
                educations: { orderBy: { startYear: 'desc' } },
                portfolioItems: { orderBy: { createdAt: 'desc' } }
            },
        });
        if (!profile) throw new NotFoundException('Profile not found');
        return profile;
    }

    async updateProfile(userId: string, data: any) {
        return this.prisma.profile.update({
            where: { userId },
            data,
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
