import { Module } from '@nestjs/common';
import { EntitlementService } from './entitlement.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [EntitlementService],
    exports: [EntitlementService]
})
export class EntitlementModule { }
