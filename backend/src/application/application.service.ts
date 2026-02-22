import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditService } from '../credit/credit.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ApplicationService {
    private readonly logger = new Logger(ApplicationService.name);

    constructor(
        private prisma: PrismaService,
        private creditService: CreditService,
        private emailService: EmailService,
    ) { }

    async apply(freelancerId: string, data: { jobId: string; coverLetter: string; proposedRate?: number }) {
        // Check job exists and is open
        const job = await this.prisma.job.findUnique({ where: { id: data.jobId } });
        if (!job) throw new NotFoundException('Job not found');
        if (job.status !== 'OPEN') throw new BadRequestException('This job is no longer accepting applications');
        if (job.employerId === freelancerId) throw new BadRequestException('Cannot apply to your own job');

        // Check not already applied
        const existing = await this.prisma.jobApplication.findUnique({
            where: { jobId_freelancerId: { jobId: data.jobId, freelancerId } },
        });
        if (existing) throw new BadRequestException('You have already applied to this job');

        // Deduct 1 credit
        await this.creditService.deductCredit(freelancerId, `Applied to job: ${job.title}`);

        // Create application
        const application = await this.prisma.jobApplication.create({
            data: {
                jobId: data.jobId,
                freelancerId,
                coverLetter: data.coverLetter,
                proposedRate: data.proposedRate,
            },
            include: {
                job: { select: { title: true, employerId: true } },
            },
        });

        // Notify employer internally
        await this.prisma.notification.create({
            data: {
                userId: job.employerId,
                type: 'APPLICATION_SUBMITTED',
                title: 'New Application',
                message: `A freelancer applied to your job "${job.title}"`,
                link: `/dashboard/applications?jobId=${job.id}`,
            },
        });

        // Fire & Forget external email to employer
        this.prisma.user.findUnique({
            where: { id: job.employerId },
            include: { profile: true }
        }).then(employer => {
            if (employer && employer.email) {
                const employerName = employer.profile?.fullName || 'Employer';
                // Also get freelancer name
                this.prisma.profile.findUnique({ where: { userId: freelancerId } }).then(freelancer => {
                    const freelancerName = freelancer?.fullName || 'A Freelancer';
                    this.emailService.sendApplicationSubmittedEmail(employer.email, employerName, freelancerName, job.title).catch(e => {
                        this.logger.error(`Failed to send application email to ${employer.email}`, e);
                    });
                });
            }
        });

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

            // Notify freelancer internally
            await tx.notification.create({
                data: {
                    userId: app.freelancerId,
                    type: 'APPLICATION_HIRED',
                    title: 'You\'re Hired! 🎉',
                    message: `You have been hired for "${app.job.title}"`,
                    link: `/dashboard/applications`,
                },
            });

            return updated;
        });

        // Fire & Forget external email to freelancer
        this.prisma.user.findUnique({
            where: { id: app.freelancerId },
            include: { profile: true }
        }).then(freelancer => {
            if (freelancer && freelancer.email) {
                const freelancerName = freelancer.profile?.fullName || 'Freelancer';
                this.emailService.sendApplicationHiredEmail(freelancer.email, freelancerName, app!.job.title).catch(e => {
                    this.logger.error(`Failed to send hire email to ${freelancer.email}`, e);
                });
            }
        });

        return txResult;
    }

    async shortlist(applicationId: string, employerId: string) {
        const app = await this.prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: { job: true },
        });
        if (!app) throw new NotFoundException('Application not found');
        if (app.job.employerId !== employerId) throw new ForbiddenException('Not your job posting');

        return this.prisma.jobApplication.update({
            where: { id: applicationId },
            data: { status: 'SHORTLISTED' },
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

            // Notify freelancer
            await tx.notification.create({
                data: {
                    userId: app.freelancerId,
                    type: 'APPLICATION_REJECTED',
                    title: 'Application Update',
                    message: `Your application for "${app.job.title}" was not selected`,
                    link: `/dashboard/applications`,
                },
            });

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
