import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KycService {
    constructor(private prisma: PrismaService) { }

    async submitKyc(userId: string, data: { cnicFrontUrl: string; cnicBackUrl: string; selfieUrl: string; nationalId?: string }) {
        // Check for duplicate CNIC usage
        const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { nationalId: true } });
        if (data.nationalId) { // Use the nationalId from the submitted data
            const existingUser = await this.prisma.user.findFirst({
                where: { nationalId: data.nationalId, id: { not: userId }, kycStatus: { in: ['APPROVED', 'PENDING'] } },
            });
            if (existingUser) {
                throw new BadRequestException('This CNIC is already registered to another account. Contact support if this is an error.');
            }
        }

        // Mock verification — in production, integrate a third-party KYC provider
        if (data.nationalId) {
            const mockVerifyResult = await this.verifyIdentityMock(data.nationalId);

            if (!mockVerifyResult.success) {
                throw new BadRequestException(mockVerifyResult.reason || 'Identity verification failed.');
            }
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: { kycStatus: 'PENDING', nationalId: data.nationalId } // Store nationalId with user
        });

        return this.prisma.kYC.upsert({
            where: { userId },
            update: { ...data, status: 'PENDING', submittedAt: new Date() },
            create: { ...data, userId, status: 'PENDING' },
        });
    }

    async getKycStatus(userId: string) {
        return this.prisma.kYC.findUnique({ where: { userId } });
    }

    /**
     * MOCK ADAPTER for Third-Party KYC (e.g. SumSub, Shufti Pro)
     * In a production environment, this would call the vendor API. 
     */
    async verifyIdentityMock(nationalId: string): Promise<{ success: boolean, status: string, reason?: string }> {
        // Mock validation: Pakistani CNIC should be roughly 13 digits (with or without dashes).
        const strippedId = nationalId.replace(/[^0-9]/g, '');

        if (strippedId.length !== 13) {
            return { success: false, status: 'REJECTED', reason: 'Invalid CNIC format. Must be 13 digits.' };
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock success response
        return { success: true, status: 'VERIFIED' };
    }
}
