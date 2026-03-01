import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MilestoneService {
    private readonly logger = new Logger(MilestoneService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Create milestones for a contract (Employer only).
     */
    async createMilestones(employerId: string, contractId: string, milestones: { description: string; amount: number }[]) {
        const contract = await this.prisma.contract.findUnique({ where: { id: contractId } });
        if (!contract) throw new NotFoundException('Contract not found.');
        if (contract.employerId !== employerId) throw new ForbiddenException('Only the employer can create milestones.');
        if (contract.status !== 'ACTIVE') throw new BadRequestException('Contract is not active.');

        const totalMilestoneAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
        if (totalMilestoneAmount > contract.amount) {
            throw new BadRequestException(`Total milestone amount (${totalMilestoneAmount}) exceeds contract amount (${contract.amount}).`);
        }

        return this.prisma.milestone.createMany({
            data: milestones.map(m => ({
                contractId,
                description: m.description,
                amount: m.amount,
                status: 'PENDING',
            })),
        });
    }

    /**
     * Get all milestones for a contract (both parties).
     */
    async getMilestones(userId: string, contractId: string) {
        const contract = await this.prisma.contract.findUnique({ where: { id: contractId } });
        if (!contract) throw new NotFoundException('Contract not found.');
        if (contract.freelancerId !== userId && contract.employerId !== userId) {
            throw new ForbiddenException('You are not a participant in this contract.');
        }

        return this.prisma.milestone.findMany({
            where: { contractId },
            orderBy: { createdAt: 'asc' },
        });
    }

    /**
     * Fund a milestone into escrow (Employer only).
     * Moves funds from employer's wallet balance → escrow lock.
     */
    async fundMilestone(employerId: string, milestoneId: string) {
        const milestone = await this.prisma.milestone.findUnique({
            where: { id: milestoneId },
            include: { contract: true },
        });

        if (!milestone) throw new NotFoundException('Milestone not found.');
        if (milestone.contract.employerId !== employerId) throw new ForbiddenException('Only the employer can fund milestones.');
        if (milestone.status !== 'PENDING') throw new BadRequestException(`Milestone is already ${milestone.status}.`);

        return this.prisma.$transaction(async (tx) => {
            // Deduct from employer's wallet and lock in escrow
            const wallet = await tx.wallet.findUnique({ where: { userId: employerId } });
            if (!wallet || wallet.balancePKR < milestone.amount) {
                throw new BadRequestException('Insufficient wallet balance to fund this milestone.');
            }

            await tx.wallet.update({
                where: { userId: employerId },
                data: {
                    balancePKR: { decrement: milestone.amount },
                    escrowLockedPKR: { increment: milestone.amount },
                },
            });

            // Log escrow lock transaction
            await tx.transaction.create({
                data: {
                    userId: employerId,
                    amountPKR: milestone.amount,
                    type: 'PAYMENT',
                    status: 'COMPLETED',
                    description: `Escrow funded for milestone: ${milestone.description}`,
                },
            });

            // Update milestone status
            const updated = await tx.milestone.update({
                where: { id: milestoneId },
                data: { status: 'FUNDED_IN_ESCROW' },
            });

            this.logger.log(`Milestone ${milestoneId} funded with PKR ${milestone.amount} into escrow`);
            return updated;
        });
    }

    /**
     * Submit work for a milestone (Freelancer only).
     */
    async submitWork(freelancerId: string, milestoneId: string) {
        const milestone = await this.prisma.milestone.findUnique({
            where: { id: milestoneId },
            include: { contract: true },
        });

        if (!milestone) throw new NotFoundException('Milestone not found.');
        if (milestone.contract.freelancerId !== freelancerId) throw new ForbiddenException('Only the freelancer can submit work.');
        if (milestone.status !== 'FUNDED_IN_ESCROW') {
            throw new BadRequestException('Milestone must be funded in escrow before submitting work.');
        }

        const updated = await this.prisma.milestone.update({
            where: { id: milestoneId },
            data: { status: 'SUBMITTED' },
        });

        this.logger.log(`Freelancer submitted work for milestone ${milestoneId}`);
        return updated;
    }

    /**
     * Approve submitted work (Employer only).
     */
    async approveWork(employerId: string, milestoneId: string) {
        const milestone = await this.prisma.milestone.findUnique({
            where: { id: milestoneId },
            include: { contract: true },
        });

        if (!milestone) throw new NotFoundException('Milestone not found.');
        if (milestone.contract.employerId !== employerId) throw new ForbiddenException('Only the employer can approve work.');
        if (milestone.status !== 'SUBMITTED') {
            throw new BadRequestException('Can only approve work that has been submitted.');
        }

        const updated = await this.prisma.milestone.update({
            where: { id: milestoneId },
            data: { status: 'APPROVED' },
        });

        this.logger.log(`Employer approved milestone ${milestoneId}`);
        return updated;
    }

    /**
     * Release escrow funds to freelancer (Employer only, after approval).
     * Moves funds from escrow → freelancer's wallet (minus commission).
     */
    async releaseFunds(employerId: string, milestoneId: string) {
        const milestone = await this.prisma.milestone.findUnique({
            where: { id: milestoneId },
            include: { contract: true },
        });

        if (!milestone) throw new NotFoundException('Milestone not found.');
        if (milestone.contract.employerId !== employerId) throw new ForbiddenException('Only the employer can release funds.');
        if (milestone.status !== 'APPROVED') {
            throw new BadRequestException('Can only release funds for approved milestones.');
        }

        const freelancerId = milestone.contract.freelancerId;
        const grossAmount = milestone.amount;

        return this.prisma.$transaction(async (tx) => {
            // Unlock escrow from employer's wallet
            await tx.wallet.update({
                where: { userId: employerId },
                data: { escrowLockedPKR: { decrement: grossAmount } },
            });

            // Calculate commission (default 10%, 0% for founding members first 3 projects)
            const freelancer = await tx.user.findUnique({
                where: { id: freelancerId },
                select: { isFoundingMember: true, role: true },
            });

            let commissionRate = 0.10;
            if (freelancer?.isFoundingMember && ['SELLER', 'STUDENT', 'FREE'].includes(freelancer.role)) {
                const completedOrders = await tx.order.count({ where: { sellerId: freelancerId, status: 'COMPLETED' } });
                const hiredJobs = await tx.jobApplication.count({ where: { freelancerId, status: 'HIRED' } });
                if (completedOrders + hiredJobs < 3) commissionRate = 0.0;
            }

            const commission = Math.round(grossAmount * commissionRate);
            const netAmount = grossAmount - commission;

            // Credit freelancer's wallet
            await tx.wallet.upsert({
                where: { userId: freelancerId },
                create: { userId: freelancerId, balancePKR: netAmount, pendingPKR: 0 },
                update: { balancePKR: { increment: netAmount } },
            });

            // Log earning transaction for freelancer
            await tx.transaction.create({
                data: {
                    userId: freelancerId,
                    amountPKR: netAmount,
                    type: 'EARNING',
                    status: 'COMPLETED',
                    description: `Milestone release: ${milestone.description} (PKR ${grossAmount}, commission ${commissionRate * 100}%)`,
                },
            });

            // Log commission if > 0
            if (commission > 0) {
                await tx.transaction.create({
                    data: {
                        userId: freelancerId,
                        amountPKR: commission,
                        type: 'COMMISSION',
                        status: 'COMPLETED',
                        description: `Platform commission on milestone (${commissionRate * 100}%)`,
                    },
                });

                // Add to platform revenue
                await tx.platformRevenue.create({
                    data: { amountPKR: commission, reason: `Milestone commission: ${milestone.description}` },
                });
            }

            // Update milestone status to RELEASED
            const updated = await tx.milestone.update({
                where: { id: milestoneId },
                data: { status: 'RELEASED' },
            });

            this.logger.log(`Released PKR ${netAmount} to freelancer ${freelancerId} for milestone ${milestoneId}`);
            return { milestone: updated, netAmount, commission, grossAmount };
        });
    }
}
