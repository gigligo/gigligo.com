import { Module } from '@nestjs/common';
import { UserStateService } from './user-state.service';
import { UserStateController } from './user-state.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EntitlementModule } from '../entitlement/entitlement.module';

@Module({
    imports: [PrismaModule, EntitlementModule],
    providers: [UserStateService],
    controllers: [UserStateController],
    exports: [UserStateService],
})
export class UserStateModule { }
