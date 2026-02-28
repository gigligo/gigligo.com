export const Events = {
    JOB_APPLIED: 'job.applied',
    JOB_HIRED: 'job.hired',
    JOB_SHORTLISTED: 'job.shortlisted',
    JOB_REJECTED: 'job.rejected',
    ORDER_CREATED: 'order.created',
    ORDER_DELIVERED: 'order.delivered',
    ORDER_COMPLETED: 'order.completed',
    KYC_APPROVED: 'kyc.approved',
    KYC_REJECTED: 'kyc.rejected',
    LOW_CREDITS: 'credits.low',
    PAYMENT_RECEIVED: 'payment.received'
} as const;

export class JobAppliedEvent {
    constructor(
        public readonly jobId: string,
        public readonly jobTitle: string,
        public readonly employerId: string,
        public readonly freelancerId: string,
        public readonly applicationId: string
    ) { }
}

export class JobHiredEvent {
    constructor(
        public readonly jobId: string,
        public readonly jobTitle: string,
        public readonly employerId: string,
        public readonly freelancerId: string,
        public readonly applicationId: string
    ) { }
}

export class JobShortlistedEvent {
    constructor(
        public readonly jobId: string,
        public readonly jobTitle: string,
        public readonly employerId: string,
        public readonly freelancerId: string,
        public readonly applicationId: string
    ) { }
}

export class JobRejectedEvent {
    constructor(
        public readonly jobId: string,
        public readonly jobTitle: string,
        public readonly employerId: string,
        public readonly freelancerId: string,
        public readonly applicationId: string
    ) { }
}

export class OrderCreatedEvent {
    constructor(
        public readonly orderId: string,
        public readonly gigTitle: string,
        public readonly buyerId: string,
        public readonly sellerId: string,
    ) { }
}

export class OrderDeliveredEvent {
    constructor(
        public readonly orderId: string,
        public readonly gigTitle: string,
        public readonly buyerId: string,
        public readonly sellerId: string,
    ) { }
}

export class OrderCompletedEvent {
    constructor(
        public readonly orderId: string,
        public readonly gigTitle: string,
        public readonly buyerId: string,
        public readonly sellerId: string,
        public readonly amountPKR: number,
    ) { }
}

export class KycApprovedEvent {
    constructor(
        public readonly userId: string,
        public readonly userEmail: string,
        public readonly fullName: string
    ) { }
}

export class KycRejectedEvent {
    constructor(
        public readonly userId: string,
        public readonly userEmail: string,
        public readonly fullName: string,
        public readonly reason: string
    ) { }
}

export class LowCreditsEvent {
    constructor(
        public readonly userId: string,
        public readonly creditsRemaining: number
    ) { }
}

export class PaymentReceivedEvent {
    constructor(
        public readonly userId: string,
        public readonly amountPKR: number,
        public readonly source: string,
        public readonly commissionPKR?: number,
        public readonly rawGrossPKR?: number,
    ) { }
}
