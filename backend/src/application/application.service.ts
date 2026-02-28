import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditService } from '../credit/credit.service';
import { EntitlementService } from '../entitlement/entitlement.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events, JobAppliedEvent, JobHiredEvent } from '../events/event.dictionary';

@Injectable()
export class ApplicationService {
    private readonly logger = new Logger(ApplicationService.name);

    constructor(
        private prisma: PrismaService,
        private creditService: CreditService,
        private entitlementService: EntitlementService,
        private eventEmitter: EventEmitter2
    ) { }

    async apply(freelancerId: string, data: { jobId: string; coverLetter: string; proposedRate?: number; timeline?: string }) {
        // Check job exists and is open
        const job = await this.prisma.job.findUnique({ where: { id: data.jobId } });
        if (!job) throw new NotFoundException('Job not found');
        if (job.status !== 'OPEN') throw new BadRequestException('This job is no longer accepting applications');
        if (job.employerId === freelancerId) throw new BadRequestException('Cannot apply to your own job');

        // KYC check: freelancer must be verified before applying
        const freelancer = await this.prisma.user.findUnique({ where: { id: freelancerId } });
        if (!freelancer || freelancer.kycStatus !== 'APPROVED') {
            throw new BadRequestException('You must complete KYC verification before applying to jobs. Go to Dashboard → KYC Verification.');
        }

        // Check not already applied
        const existing = await this.prisma.jobApplication.findUnique({
            where: { jobId_freelancerId: { jobId: data.jobId, freelancerId } },
        });
        if (existing) throw new BadRequestException('You have already applied to this job');

        // Dynamic Daily proposal rate limit via Entitlement Engine
        const canApply = await this.entitlementService.canApplyToJob(freelancerId);
        if (!canApply) {
            throw new BadRequestException('Monthly proposal limit reached. Upgrade to a premium tier for more proposals!');
        }

        // Deduct 1 credit
        await this.creditService.deductCredit(freelancerId, `Applied to job: ${job.title}`);

        const application = await this.prisma.jobApplication.create({
            data: {
                jobId: data.jobId,
                freelancerId,
                coverLetter: data.coverLetter,
                proposedRate: data.proposedRate,
                timeline: data.timeline,
            } as any,
            include: {
                job: { select: { title: true, employerId: true } },
            } as any,
        });

        // Fire decoupled event to be handled by EventProcessorService
        this.eventEmitter.emit(
            Events.JOB_APPLIED,
            new JobAppliedEvent(
                job.id,
                job.title,
                job.employerId,
                freelancerId,
                application.id
            )
        );

        return application;
    }

    async getApplicationsForJob(jobId: string, employerId: string) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (!job) throw new NotFoundException('Job not found');
        if (job.employerId !== employerId) throw new ForbiddenException('Not your job posting');

        return this.prisma.jobApplication.findMany({
            where: { jobId },
            include: {
                freelancer: {
                    select: {
                        id: true,
                        profile: {
                            select: { fullName: true, avatarUrl: true, bio: true, skills: true, hourlyRate: true },
                        },
                    },
                },
            },
            orderBy: { appliedAt: 'desc' },
        });
    }

    async getMyApplications(freelancerId: string) {
        return this.prisma.jobApplication.findMany({
            where: { freelancerId },
            include: {
                job: {
                    select: {
                        id: true, title: true, category: true, budgetMin: true, budgetMax: true, status: true,
                        employer: { select: { profile: { select: { fullName: true } } } },
                    },
                },
            },
            orderBy: { appliedAt: 'desc' },
        });
    }

    async hire(applicationId: string, employerId: string) {
        const app = await this.prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: { job: true },
        });
        if (!app) throw new NotFoundException('Application not found');
        if (app.job.employerId !== employerId) throw new ForbiddenException('Not your job posting');
        if (app.status !== 'PENDING' && app.status !== 'SHORTLISTED') {
            throw new BadRequestException('Application is not in a hireable state');
        }

        const txResult = await this.prisma.$transaction(async (tx) => {
            // Update application status
            const updated = await tx.jobApplication.update({
                where: { id: applicationId },
                data: { status: 'HIRED' },
            });

            // Mark job as filled
            await tx.job.update({
                where: { id: app.jobId },
                data: { status: 'FILLED' },
            });

            return updated;
        });

        // Fire decoupled event - the processor will handle notifications & emails
        this.eventEmitter.emit(Events.JOB_HIRED, new JobHiredEvent(
            app.jobId,
            app.job.title,
            employerId,
            app.freelancerId,
            app.id
        ));

        return txResult;
    }

    async shortlist(applicationId: string, employerId: string) {
        const app = await this.prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: { job: true },
        });
        if (!app) throw new NotFoundException('Application not found');
        if (app.job.employerId !== employerId) throw new ForbiddenException('Not your job posting');

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.jobApplication.update({
                where: { id: applicationId },
                data: { status: 'SHORTLISTED' },
            });

            // Notification omitted, we will rely on Event Bus for this moving forward
            return updated;
        });
    }

    async reject(applicationId: string, employerId: string) {
        const app = await this.prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: { job: true },
        });
        if (!app) throw new NotFoundException('Application not found');
        if (app.job.employerId !== employerId) throw new ForbiddenException('Not your job posting');

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.jobApplication.update({
                where: { id: applicationId },
                data: { status: 'REJECTED' },
            });

            // Notification omitted, we will rely on Event Bus for this moving forward
            return updated;
        });
    }

    async withdraw(applicationId: string, freelancerId: string) {
        const app = await this.prisma.jobApplication.findUnique({ where: { id: applicationId } });
        if (!app) throw new NotFoundException('Application not found');
        if (app.freelancerId !== freelancerId) throw new ForbiddenException('Not your application');
        if (app.status !== 'PENDING') throw new BadRequestException('Can only withdraw pending applications');

        const updated = await this.prisma.jobApplication.update({
            where: { id: applicationId },
            data: { status: 'WITHDRAWN' },
        });

        // Refund the credit
        await this.creditService.refundCredit(freelancerId, 'Application withdrawn - credit refunded');

        return updated;
    }
}
