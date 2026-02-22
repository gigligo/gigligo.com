import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CreditModule } from '../credit/credit.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [PrismaModule, CreditModule, EmailModule],
    controllers: [ApplicationController],
    providers: [ApplicationService],
    exports: [ApplicationService],
})
export class ApplicationModule { }
