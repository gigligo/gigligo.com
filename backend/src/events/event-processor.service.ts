import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events, JobAppliedEvent, JobHiredEvent, JobShortlistedEvent, JobRejectedEvent, OrderCreatedEvent, OrderCompletedEvent, KycApprovedEvent, KycRejectedEvent, LowCreditsEvent, PaymentReceivedEvent, OrderDeliveredEvent } from './event.dictionary';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventProcessorService {
    private readonly logger = new Logger(EventProcessorService.name);

    constructor(
        private notificationService: NotificationService,
        private emailService: EmailService,
        private prisma: PrismaService
    ) { }

    @OnEvent(Events.JOB_APPLIED)
    async handleJobAppliedEvent(payload: JobAppliedEvent) {
        this.logger.log(`Processing JobAppliedEvent for Job ID: ${payload.jobId}`);

        // Generate In-App Notification
        await this.notificationService.create(payload.employerId, {
            type: 'APPLICATION_SUBMITTED',
            title: 'New Job Application',
            message: `You received a new application for ${payload.jobTitle}`,
            link: `/dashboard/jobs/${payload.jobId}/applications`,
        });

        // Generate Async Email
        const [employer, freelancer] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: payload.employerId }, select: { email: true, profile: { select: { fullName: true } } } }),
            this.prisma.user.findUnique({ where: { id: payload.freelancerId }, select: { profile: { select: { fullName: true } } } }),
        ]);

        if (employer?.email) {
            await this.emailService.sendApplicationSubmittedEmail(
                employer.email,
                employer.profile?.fullName || 'Employer',
                freelancer?.profile?.fullName || 'A Freelancer',
                payload.jobTitle
            );
        }
    }

    @OnEvent(Events.JOB_HIRED)
    async handleJobHiredEvent(payload: JobHiredEvent) {
        this.logger.log(`Processing JobHiredEvent for Application ID: ${payload.applicationId}`);

        await this.notificationService.create(payload.freelancerId, {
            type: 'APPLICATION_HIRED',
            title: 'You\'re Hired! 🎉',
            message: `You have been hired for "${payload.jobTitle}"`,
            link: `/dashboard/applications`,
        });

        const freelancer = await this.prisma.user.findUnique({ where: { id: payload.freelancerId }, select: { email: true, profile: { select: { fullName: true } } } });

        if (freelancer?.email) {
            await this.emailService.sendApplicationHiredEmail(
                freelancer.email,
                freelancer.profile?.fullName || 'Freelancer',
                payload.jobTitle
            );
        }
    }

    @OnEvent(Events.JOB_SHORTLISTED)
    async handleJobShortlistedEvent(payload: JobShortlistedEvent) {
        this.logger.log(`Processing JobShortlistedEvent for Application ID: ${payload.applicationId}`);

        await this.notificationService.create(payload.freelancerId, {
            type: 'SYSTEM',
            title: 'Application Shortlisted! ⭐',
            message: `Your application for "${payload.jobTitle}" has been shortlisted`,
            link: `/dashboard/applications`,
        });
    }

    @OnEvent(Events.JOB_REJECTED)
    async handleJobRejectedEvent(payload: JobRejectedEvent) {
        this.logger.log(`Processing JobRejectedEvent for Application ID: ${payload.applicationId}`);

        await this.notificationService.create(payload.freelancerId, {
            type: 'APPLICATION_REJECTED',
            title: 'Application Update',
            message: `Your application for "${payload.jobTitle}" was not selected`,
            link: `/dashboard/applications`,
        });
    }

    @OnEvent(Events.ORDER_CREATED)
    async handleOrderCreatedEvent(payload: OrderCreatedEvent) {
        this.logger.log(`Processing OrderCreatedEvent for Order ID: ${payload.orderId}`);

        await this.notificationService.create(payload.sellerId, {
            type: 'ORDER_STARTED',
            title: 'New Order Received',
            message: `You have a new order pending for your gig: ${payload.gigTitle}`,
            link: `/dashboard/orders/${payload.orderId}`,
        });

        const seller = await this.prisma.user.findUnique({ where: { id: payload.sellerId }, select: { email: true, profile: { select: { fullName: true } } } });
        const buyer = await this.prisma.user.findUnique({ where: { id: payload.buyerId }, select: { profile: { select: { fullName: true } } } });

        if (seller?.email) {
            await this.emailService.sendOrderCreatedEmail(
                seller.email,
                buyer?.profile?.fullName || 'A Buyer',
                payload.gigTitle,
                payload.orderId
            );
        }
    }

    @OnEvent(Events.ORDER_DELIVERED)
    async handleOrderDeliveredEvent(payload: OrderDeliveredEvent) {
        this.logger.log(`Processing OrderDeliveredEvent for Order ID: ${payload.orderId}`);

        await this.notificationService.create(payload.buyerId, {
            type: 'ORDER_DELIVERED',
            title: 'Order Delivered',
            message: `Your order for "${payload.gigTitle}" has been delivered. Please review it.`,
            link: `/dashboard/purchases/${payload.orderId}`,
        });

        // Optionally send email if method exists in EmailService, falling back if not.
        // Assuming we will add sendOrderDeliveredEmail later if needed.
    }

    @OnEvent(Events.ORDER_COMPLETED)
    async handleOrderCompletedEvent(payload: OrderCompletedEvent) {
        this.logger.log(`Processing OrderCompletedEvent for Order ID: ${payload.orderId}`);

        await this.notificationService.create(payload.sellerId, {
            type: 'ORDER_COMPLETED',
            title: 'Order Completed & Paid',
            message: `Your order for "${payload.gigTitle}" is marked as completed. Earnings added!`,
            link: `/dashboard/orders/${payload.orderId}`,
        });

        const seller = await this.prisma.user.findUnique({ where: { id: payload.sellerId }, select: { email: true, profile: { select: { fullName: true } } } });

        if (seller?.email) {
            await this.emailService.sendOrderCompletedEmail(
                seller.email,
                seller.profile?.fullName || 'Seller',
                payload.gigTitle,
                payload.amountPKR
            );
        }
    }

    @OnEvent(Events.KYC_APPROVED)
    async handleKycApprovedEvent(payload: KycApprovedEvent) {
        this.logger.log(`Processing KycApprovedEvent for User ID: ${payload.userId}`);

        await this.notificationService.create(payload.userId, {
            type: 'KYC_APPROVED',
            title: 'Identity Verified',
            message: `Congratulations! Your identity and payment details have been fully verified.`,
            link: `/dashboard/settings`,
        });

        // Custom email if implemented
    }

    @OnEvent(Events.KYC_REJECTED)
    async handleKycRejectedEvent(payload: KycRejectedEvent) {
        this.logger.log(`Processing KycRejectedEvent for User ID: ${payload.userId}`);

        await this.notificationService.create(payload.userId, {
            type: 'KYC_REJECTED',
            title: 'Identity Verification Rejected',
            message: `Your verification failed. Reason: ${payload.reason}. Please try again.`,
            link: `/dashboard/settings`,
        });
    }

    @OnEvent(Events.LOW_CREDITS)
    async handleLowCreditsEvent(payload: LowCreditsEvent) {
        this.logger.log(`Processing LowCreditsEvent for User ID: ${payload.userId}`);

        await this.notificationService.create(payload.userId, {
            type: 'LOW_CREDITS',
            title: 'Low Credits Alert',
            message: `You only have ${payload.creditsRemaining} credits left. Top up so you don't miss out on jobs.`,
            link: `/dashboard/credits`,
        });
    }

    @OnEvent(Events.PAYMENT_RECEIVED)
    async handlePaymentReceivedEvent(payload: PaymentReceivedEvent) {
        this.logger.log(`Processing PaymentReceivedEvent for User ID: ${payload.userId}`);

        await this.notificationService.create(payload.userId, {
            type: 'PAYMENT_RECEIVED',
            title: 'Payment Received',
            message: `You earned PKR ${payload.amountPKR} from ${payload.source}`,
            link: `/dashboard/earnings`,
        });
    }
}
