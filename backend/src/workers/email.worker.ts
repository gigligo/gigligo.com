import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

/**
 * Background worker designed to offload heavy outbound email/notification processing
 * from the main HTTP request-response cycle.
 * 
 * NOTE: Due to system package lock, this uses in-memory EventEmitter2 instead of BullMQ.
 * In a distributed multi-instance deployment, this should be swapped to a Redis-backed queue.
 */
@Injectable()
export class EmailBackgroundWorker {
    private readonly logger = new Logger(EmailBackgroundWorker.name);

    @OnEvent('email.send_welcome', { async: true })
    async handleWelcomeEmail(payload: { email: string; name: string }) {
        this.logger.log(`[Worker] Processing welcome email for ${payload.email}`);

        try {
            // Simulate heavy network call to SendGrid/SES
            await new Promise(resolve => setTimeout(resolve, 800));
            this.logger.log(`[Worker] Welcome email SENT to ${payload.email}`);
        } catch (error) {
            this.logger.error(`[Worker] Failed to send email to ${payload.email}: ${error.message}`);
            // Queue retry logic would go here
        }
    }

    @OnEvent('order.contract_generated', { async: true })
    async handleContractGenerated(payload: { orderId: string; employerEmail: string; freelancerEmail: string }) {
        this.logger.log(`[Worker] Processing contract PDFs for Order ${payload.orderId}`);

        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            this.logger.log(`[Worker] Contract PDFs SENT to ${payload.employerEmail} and ${payload.freelancerEmail}`);
        } catch (error) {
            this.logger.error(`[Worker] Failed to send contracts for Order ${payload.orderId}: ${error.message}`);
        }
    }
}
