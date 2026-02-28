import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) { }

    async getConversations(userId: string) {
        return this.prisma.conversation.findMany({
            where: {
                OR: [
                    { freelancerId: userId },
                    { employerId: userId }
                ]
            },
            include: {
                freelancer: { select: { id: true, email: true, profile: { select: { fullName: true, avatarUrl: true } } } },
                employer: { select: { id: true, email: true, profile: { select: { fullName: true, avatarUrl: true } } } },
                order: { select: { id: true, status: true, gig: { select: { title: true } } } },
                job: { select: { id: true, status: true, title: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async getConversation(id: string, userId: string) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id },
            include: {
                freelancer: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } },
                employer: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } },
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: { sender: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } } }
                }
            }
        });

        if (!conversation) throw new NotFoundException('Conversation not found');
        if (conversation.freelancerId !== userId && conversation.employerId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return conversation;
    }

    async saveMessage(conversationId: string, senderId: string, content: string) {
        const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation) throw new NotFoundException('Conversation not found');
        if (conversation.freelancerId !== senderId && conversation.employerId !== senderId) {
            throw new ForbiddenException('Access denied');
        }

        const message = await this.prisma.message.create({
            data: {
                content,
                senderId,
                conversationId,
            },
            include: {
                sender: { select: { id: true, profile: { select: { fullName: true, avatarUrl: true } } } }
            }
        });

        // Update conversation timestamp for sorting
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        return message;
    }

    async findOrCreateConversation(freelancerId: string, employerId: string, orderId?: string, jobId?: string) {
        if (!orderId && !jobId) {
            throw new ForbiddenException('Global open chats are not allowed. Conversations must be tied to a specific job or order.');
        }

        if (jobId) {
            const application = await this.prisma.jobApplication.findFirst({
                where: { jobId, freelancerId },
                include: { job: true }
            });
            if (!application) {
                throw new ForbiddenException('Freelancers must apply to the job before messaging is allowed.');
            }
            if (application.job.employerId !== employerId) {
                throw new ForbiddenException('Invalid employer for this job.');
            }
        }

        if (orderId) {
            const order = await this.prisma.order.findUnique({ where: { id: orderId } });
            if (!order) {
                throw new NotFoundException('Order not found');
            }
            if (order.sellerId !== freelancerId || order.buyerId !== employerId) {
                throw new ForbiddenException('Invalid participants for this order.');
            }
        }

        let whereClause: any = { freelancerId, employerId };

        if (orderId) whereClause.orderId = orderId;
        if (jobId) whereClause.jobId = jobId;

        // Fast path: find existing
        const existing = await this.prisma.conversation.findFirst({
            where: whereClause
        });

        if (existing) return existing;

        // Slow path: create new
        return this.prisma.conversation.create({
            data: {
                freelancerId,
                employerId,
                orderId,
                jobId
            }
        });
    }
}
