import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger, UseGuards } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/notifications'
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(NotificationGateway.name);
    private connectedUsers = new Map<string, string>(); // socketId -> userId

    constructor(private readonly jwtService: JwtService) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
            if (!token) throw new Error('Missing token');

            const payload = this.jwtService.verify(token);
            const userId = payload.sub;

            this.connectedUsers.set(client.id, userId);
            // Join a room specifically for this user to easily emit directed messages
            client.join(`user_${userId}`);

            this.logger.log(`User ${userId} connected to notifications WebSocket.`);
        } catch (error) {
            this.logger.error(`WebSocket connection rejected: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = this.connectedUsers.get(client.id);
        if (userId) {
            this.connectedUsers.delete(client.id);
            this.logger.log(`User ${userId} disconnected from notifications.`);
        }
    }

    // Used by the NotificationService to push events to the client
    sendNotificationToUser(userId: string, notification: any) {
        this.server.to(`user_${userId}`).emit('newNotification', notification);
    }
}
