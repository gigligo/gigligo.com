import { Injectable, Logger, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
    private readonly logger = new Logger(OtpService.name);

    // Rate limit: max OTP requests per email per hour
    private readonly MAX_OTP_PER_HOUR = 5;
    // OTP validity in minutes
    private readonly OTP_TTL_MINUTES = 5;

    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) { }

    /**
     * Generate a 6-digit OTP, store it, and send via email.
     */
    async generateAndSend(email: string, type: 'LOGIN' | 'EMAIL_VERIFY' | 'PHONE_VERIFY'): Promise<{ message: string }> {
        // ── Rate limiting ──
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentCount = await this.prisma.otpCode.count({
            where: {
                email,
                type,
                createdAt: { gte: oneHourAgo },
            },
        });

        if (recentCount >= this.MAX_OTP_PER_HOUR) {
            throw new HttpException(
                'Too many OTP requests. Please wait before trying again.',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        // ── Invalidate previous unused OTPs for this email/type ──
        await this.prisma.otpCode.updateMany({
            where: { email, type, used: false },
            data: { used: true },
        });

        // ── Generate 6-digit code ──
        const code = randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + this.OTP_TTL_MINUTES * 60 * 1000);

        await this.prisma.otpCode.create({
            data: { email, code, type, expiresAt },
        });

        // ── Send email ──
        const subjectMap = {
            LOGIN: 'Your Login Verification Code',
            EMAIL_VERIFY: 'Verify Your Email Address',
            PHONE_VERIFY: 'Your Verification Code',
        };

        const html = `
            <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 500px; margin: 0 auto; text-align: center;">
                <h2 style="color: #0d9488; margin-bottom: 8px;">Gigligo Verification</h2>
                <p style="color: #666; margin-bottom: 24px;">Use this code to verify your identity. It expires in ${this.OTP_TTL_MINUTES} minutes.</p>
                <div style="background: linear-gradient(135deg, #0d9488 0%, #065f46 100%); color: white; font-size: 36px; font-weight: bold; letter-spacing: 12px; padding: 20px 30px; border-radius: 12px; display: inline-block; margin-bottom: 24px;">
                    ${code}
                </div>
                <p style="color: #999; font-size: 13px;">If you didn't request this code, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
                <p style="color: #bbb; font-size: 11px;">Gigligo — Pakistan's Premier Talent Marketplace</p>
            </div>
        `;

        await this.emailService.sendMail(email, subjectMap[type], html);
        this.logger.log(`OTP sent to ${email} (type: ${type})`);

        return { message: 'Verification code sent to your email.' };
    }

    /**
     * Verify a submitted OTP code.
     * Returns true if valid, throws otherwise.
     */
    async verify(email: string, code: string, type: 'LOGIN' | 'EMAIL_VERIFY' | 'PHONE_VERIFY'): Promise<boolean> {
        const otp = await this.prisma.otpCode.findFirst({
            where: {
                email,
                code,
                type,
                used: false,
                expiresAt: { gte: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!otp) {
            throw new BadRequestException('Invalid or expired verification code.');
        }

        // Mark as used
        await this.prisma.otpCode.update({
            where: { id: otp.id },
            data: { used: true },
        });

        return true;
    }
}
