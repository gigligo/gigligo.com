import { Injectable, BadRequestException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TwoFactorService {
    constructor(private prisma: PrismaService) { }

    async generateSecret(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new BadRequestException('User not found');

        // Generate a new secret
        const secret = speakeasy.generateSecret({
            name: `Gigligo Platform (${user.email})`
        });

        // Save secret to DB
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret.base32 },
        });

        // Generate QR code Data URI
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url || '');

        return {
            secret: secret.base32,
            qrCodeUrl
        };
    }

    async verifyCodeAndEnable(userId: string, code: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            throw new BadRequestException('2FA is not set up for this user');
        }

        const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 1 // Allow 1 step of time drift
        });

        if (!isValid) {
            throw new BadRequestException('Invalid authentication code');
        }

        // Mark 2FA as enabled in DB
        await this.prisma.user.update({
            where: { id: userId },
            data: { isTwoFactorEnabled: true },
        });

        return { success: true, message: '2FA enabled successfully' };
    }

    async disable(userId: string, code: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            throw new BadRequestException('2FA is not set up for this user');
        }

        const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
            window: 1
        });

        if (!isValid) {
            throw new BadRequestException('Invalid authentication code');
        }

        // Disable 2FA
        await this.prisma.user.update({
            where: { id: userId },
            data: { isTwoFactorEnabled: false, twoFactorSecret: null },
        });

        return { success: true, message: '2FA disabled successfully' };
    }

    validateCode(secret: string, code: string): boolean {
        return speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code,
            window: 1
        });
    }
}
