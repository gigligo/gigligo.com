import { Module } from '@nestjs/common';
import { UserStateService } from './user-state.service';
import { UserStateController } from './user-state.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [UserStateService],
    controllers: [UserStateController],
    exports: [UserStateService],
})
export class UserStateModule { }
