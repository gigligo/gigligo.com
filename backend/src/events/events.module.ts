import { Module } from '@nestjs/common';
import { EventProcessorService } from './event-processor.service';
import { NotificationModule } from '../notification/notification.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [NotificationModule, EmailModule],
    providers: [EventProcessorService],
    exports: [EventProcessorService],
})
export class EventsModule { }
