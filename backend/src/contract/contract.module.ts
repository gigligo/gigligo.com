import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [ContractService],
    controllers: [ContractController],
    exports: [ContractService],
})
export class ContractModule { }
