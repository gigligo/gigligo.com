import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobService {
    constructor(private prisma: PrismaService) { }

    async create(employerId: string, data: {
        title: string;
        description: string;
        category: string;
        tags?: string[];
        budgetMin: number;
        budgetMax: number;
        deadline?: string;
        location?: string;
        jobType?: 'REMOTE' | 'ONSITE' | 'HYBRID';
    }) {
        // KYC check: employer must be verified before posting jobs
        const employer = await this.prisma.user.findUnique({ where: { id: employerId }, select: { kycStatus: true } });
        if (!employer || employer.kycStatus !== 'APPROVED') {
            throw new BadRequestException('You must complete KYC verification before posting jobs. Go to Dashboard → KYC Verification.');
        }

        return this.prisma.job.create({
            data: {
                employerId,
                title: data.title,
                description: data.description,
                category: data.category,
                tags: data.tags || [],
                budgetMin: data.budgetMin,
                budgetMax: data.budgetMax,
                deadline: data.deadline ? new Date(data.deadline) : null,
                location: data.location,
                jobType: data.jobType || 'REMOTE',
            },
            include: {
                employer: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } },
                _count: { select: { applications: true } },
            },
        });
    }

    async findAll(filters: {
        category?: string;
        search?: string;
        jobType?: string;
        budgetMin?: number;
        budgetMax?: number;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: any = { status: filters.status || 'OPEN', deletedAt: null };
        if (filters.category) where.category = filters.category;
        if (filters.jobType) where.jobType = filters.jobType;
        if (filters.search) {
            where.OR = [
                { title: { search: filters.search.split(' ').join(' | ') } },
                { description: { search: filters.search.split(' ').join(' | ') } },
            ];
        }
        if (filters.budgetMin || filters.budgetMax) {
            where.budgetMax = {};
            if (filters.budgetMin) where.budgetMax.gte = filters.budgetMin;
            if (filters.budgetMax) where.budgetMax.lte = filters.budgetMax;
        }

        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.prisma.job.findMany({
                where,
                include: {
                    employer: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } },
                    _count: { select: { applications: true } },
                },
                orderBy: [{ isBoosted: 'desc' }, { createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.job.count({ where }),
        ]);

        return { items, total, page, limit };
    }

    async findOne(id: string) {
        const job = await this.prisma.job.findUnique({
            where: { id },
            include: {
                employer: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true, location: true } } } },
                _count: { select: { applications: true } },
            },
        });
        if (!job || job.deletedAt) throw new NotFoundException('Job not found');
        return job;
    }

    async update(id: string, employerId: string, data: any) {
        const job = await this.prisma.job.findUnique({ where: { id } });
        if (!job || job.deletedAt) throw new NotFoundException('Job not found');
        if (job.employerId !== employerId) throw new ForbiddenException('Not your job posting');

        const updatedJob = await this.prisma.job.update({ where: { id }, data });

        await this.prisma.auditLog.create({
            data: {
                userId: employerId,
                action: 'UPDATE_JOB',
                targetId: id,
                details: `Updated job: ${data.title || job.title}`
            }
        });

        return updatedJob;
    }

    async deleteJob(id: string, employerId: string) {
        const job = await this.prisma.job.findUnique({
            where: { id },
            include: { applications: { where: { status: 'HIRED' } } }
        });
        if (!job || job.deletedAt) throw new NotFoundException('Job not found');
        if (job.employerId !== employerId) throw new ForbiddenException('Not your job posting');

        await this.prisma.auditLog.create({
            data: {
                userId: employerId,
                action: 'DELETE_JOB',
                targetId: id,
                details: `Deleted job: ${job.title}`
            }
        });

        if (job.applications && job.applications.length > 0) {
            return this.prisma.job.update({
                where: { id },
                data: { status: 'ARCHIVED' }
            });
        }

        return this.prisma.job.update({
            where: { id },
            data: { deletedAt: new Date(), status: 'CLOSED' }
        });
    }

    async getMyJobs(employerId: string) {
        return this.prisma.job.findMany({
            where: { employerId, deletedAt: null },
            include: { _count: { select: { applications: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async boostJob(id: string, employerId: string, durationDays: number, amountPKR: number) {
        const job = await this.prisma.job.findUnique({ where: { id } });
        if (!job) throw new NotFoundException('Job not found');
        if (job.employerId !== employerId) throw new ForbiddenException('Not your job posting');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        return this.prisma.job.update({
            where: { id },
            data: { isBoosted: true, boostExpiry: expiresAt },
        });
    }
}
