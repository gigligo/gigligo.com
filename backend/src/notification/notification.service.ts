import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
    constructor(
        private prisma: PrismaService,
        private gateway: NotificationGateway
    ) { }

    async create(userId: string, data: { type: string; title: string; message: string; link?: string }) {
        const notification = await this.prisma.notification.create({
            data: {
                userId,
                type: data.type as any,
                title: data.title,
                message: data.message,
                link: data.link,
            },
        });

        // Push real-time event to active user's socket
        this.gateway.sendNotificationToUser(userId, notification);

        return notification;
    }

    async getAll(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total, unreadCount] = await Promise.all([
            this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({ where: { userId } }),
            this.prisma.notification.count({ where: { userId, isRead: false } }),
        ]);
        return { items, total, unreadCount, page, limit };
    }

    async getUnreadCount(userId: string) {
        const count = await this.prisma.notification.count({ where: { userId, isRead: false } });
        return { unreadCount: count };
    }

    async markAsRead(id: string, userId: string) {
        return this.prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }

    async markAllRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
}
