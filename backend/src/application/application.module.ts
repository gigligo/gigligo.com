import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CreditModule } from '../credit/credit.module';
import { EmailModule } from '../email/email.module';
import { UserStateModule } from '../user-state/user-state.module';
import { EntitlementModule } from '../entitlement/entitlement.module';

@Module({
    imports: [PrismaModule, CreditModule, EmailModule, UserStateModule, EntitlementModule],
    providers: [ApplicationService],
    controllers: [ApplicationController],
})
export class ApplicationModule { }
