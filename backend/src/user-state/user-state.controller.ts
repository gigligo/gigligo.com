import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserStateService } from './user-state.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user/state')
export class UserStateController {
    constructor(private readonly userStateService: UserStateService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserState(@Req() req: any) {
        return this.userStateService.getUserState(req.user.id);
    }
}
