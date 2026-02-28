import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MatchingEngineService } from './matching.service';

@Module({
    imports: [PrismaModule],
    controllers: [JobController],
    providers: [JobService, MatchingEngineService],
    exports: [JobService, MatchingEngineService],
})
export class JobModule { }
