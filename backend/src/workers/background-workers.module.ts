import { Module } from '@nestjs/common';
import { EmailBackgroundWorker } from './email.worker';

@Module({
    providers: [EmailBackgroundWorker],
})
export class BackgroundWorkersModule { }
