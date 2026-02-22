import { Controller, Get, Patch, Param, Query, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    @Get()
    getAll(@Req() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
        return this.notificationService.getAll(req.user.id, page ? +page : 1, limit ? +limit : 20);
    }

    @Get('unread-count')
    getUnreadCount(@Req() req: any) {
        return this.notificationService.getUnreadCount(req.user.id);
    }

    @Patch(':id/read')
    markAsRead(@Req() req: any, @Param('id') id: string) {
        return this.notificationService.markAsRead(id, req.user.id);
    }

    @Patch('read-all')
    markAllRead(@Req() req: any) {
        return this.notificationService.markAllRead(req.user.id);
    }
}
