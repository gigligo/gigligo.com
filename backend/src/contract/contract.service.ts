import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractService {
    private readonly logger = new Logger(ContractService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Create a contract when an employer accepts a proposal.
     * This also updates the application status to HIRED and the job status to FILLED.
     */
    async createFromApplication(employerId: string, applicationId: string) {
        const application = await this.prisma.jobApplication.findUnique({
            where: { id: applicationId },
            include: { job: true, freelancer: { include: { profile: true } } },
        });

        if (!application) throw new NotFoundException('Application not found.');
        if (application.job.employerId !== employerId) {
            throw new ForbiddenException('You are not the employer for this job.');
        }
        if (application.status === 'HIRED') {
            throw new BadRequestException('This application has already been accepted.');
        }

        // Create contract + update application + update job in a transaction
        const contract = await this.prisma.$transaction(async (tx) => {
            // Create the contract
            const c = await tx.contract.create({
                data: {
                    jobId: application.jobId,
                    applicationId: application.id,
                    freelancerId: application.freelancerId,
                    employerId,
                    amount: application.proposedRate || application.job.budgetMin,
                    status: 'ACTIVE',
                },
            });

            // Mark this application as HIRED
            await tx.jobApplication.update({
                where: { id: applicationId },
                data: { status: 'HIRED' },
            });

            // Reject all other pending applications for this job
            await tx.jobApplication.updateMany({
                where: {
                    jobId: application.jobId,
                    id: { not: applicationId },
                    status: 'PENDING',
                },
                data: { status: 'REJECTED' },
            });

            // Mark job as FILLED
            await tx.job.update({
                where: { id: application.jobId },
                data: { status: 'FILLED' },
            });

            return c;
        });

        this.logger.log(`Contract ${contract.id} created for job ${application.jobId}`);
        return contract;
    }

    /**
     * Mark a contract as completed (only the employer can do this).
     */
    async completeContract(employerId: string, contractId: string) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });

        if (!contract) throw new NotFoundException('Contract not found.');
        if (contract.employerId !== employerId) {
            throw new ForbiddenException('Only the employer can mark a contract as completed.');
        }
        if (contract.status !== 'ACTIVE') {
            throw new BadRequestException(`Contract is already ${contract.status.toLowerCase()}.`);
        }

        return this.prisma.contract.update({
            where: { id: contractId },
            data: { status: 'COMPLETED', completedAt: new Date() },
        });
    }

    /**
     * Get contracts for a user (as freelancer or employer).
     */
    async getMyContracts(userId: string) {
        return this.prisma.contract.findMany({
            where: {
                OR: [{ freelancerId: userId }, { employerId: userId }],
            },
            include: {
                job: { select: { title: true, category: true } },
                freelancer: { select: { profile: { select: { fullName: true, avatarUrl: true } } } },
                employer: { select: { profile: { select: { fullName: true, avatarUrl: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get a single contract by ID (must be a participant).
     */
    async getContract(userId: string, contractId: string) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
            include: {
                job: true,
                application: true,
                freelancer: { select: { profile: { select: { fullName: true, avatarUrl: true } } } },
                employer: { select: { profile: { select: { fullName: true, avatarUrl: true } } } },
            },
        });

        if (!contract) throw new NotFoundException('Contract not found.');
        if (contract.freelancerId !== userId && contract.employerId !== userId) {
            throw new ForbiddenException('You are not a participant in this contract.');
        }

        return contract;
    }
}
