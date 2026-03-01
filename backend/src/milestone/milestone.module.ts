import { Module } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [MilestoneService],
    controllers: [MilestoneController],
    exports: [MilestoneService],
})
export class MilestoneModule { }
