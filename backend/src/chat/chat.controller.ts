import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('conversations')
    async getConversations(@Req() req: any) {
        return this.chatService.getConversations(req.user.sub);
    }

    @Get('conversations/:id')
    async getConversation(@Param('id') id: string, @Req() req: any) {
        return this.chatService.getConversation(id, req.user.sub);
    }

    @Post('conversations')
    async findOrCreateConversation(
        @Req() req: any,
        @Body() body: { freelancerId: string; employerId: string; orderId?: string; jobId?: string },
    ) {
        return this.chatService.findOrCreateConversation(
            body.freelancerId,
            body.employerId,
            body.orderId,
            body.jobId,
        );
    }
}
