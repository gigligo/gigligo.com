import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { KycService } from '../kyc/kyc.service';
import { EmailService } from '../email/email.service';
import { OtpService } from '../otp/otp.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private kycService: KycService,
        private emailService: EmailService,
        private otpService: OtpService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.passwordHash && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Step 1: Send OTP to user's email
        await this.otpService.generateAndSend(user.email, 'LOGIN');

        // Return a short-lived temp token (2 minutes) that identifies the user
        // but does NOT grant full access — only used for the verify-otp step
        const tempPayload = { email: user.email, sub: user.id, purpose: 'otp-verification' };
        const tempToken = this.jwtService.sign(tempPayload, { expiresIn: '2m' });

        return {
            requiresOtp: true,
            tempToken,
            message: 'Verification code sent to your email.',
        };
    }

    /**
     * Step 2 of login: Verify the OTP code and issue the real access token.
     */
    async verifyLoginOtp(tempToken: string, code: string) {
        let decoded: any;
        try {
            decoded = this.jwtService.verify(tempToken);
        } catch {
            throw new UnauthorizedException('Session expired. Please log in again.');
        }

        if (decoded.purpose !== 'otp-verification') {
            throw new UnauthorizedException('Invalid token.');
        }

        // Verify the OTP code
        await this.otpService.verify(decoded.email, code, 'LOGIN');

        // OTP valid — issue full access token & refresh token
        const user = await this.usersService.findByEmail(decoded.email);
        if (!user) throw new UnauthorizedException();

        const payload = { email: user.email, sub: user.id, role: user.role };

        // Generate Access Token (1 Day)
        const access_token = this.jwtService.sign(payload);

        // Generate Refresh Token (7 Days)
        const refresh_token = this.jwtService.sign(
            { sub: user.id, purpose: 'refresh' },
            { expiresIn: '7d' }
        );

        // Store Refresh Token in DB
        await this.usersService.storeRefreshToken(user.id, refresh_token, 7);

        const { passwordHash, ...safeUser } = user;

        return {
            access_token,
            refresh_token,
            user: safeUser,
        };
    }

    async resendLoginOtp(tempToken: string) {
        let decoded: any;
        try {
            decoded = this.jwtService.verify(tempToken);
        } catch {
            throw new UnauthorizedException('Session expired. Please log in again.');
        }
        if (decoded.purpose !== 'otp-verification') {
            throw new UnauthorizedException('Invalid token.');
        }
        return this.otpService.generateAndSend(decoded.email, 'LOGIN');
    }

    /**
     * Exchange a valid Refresh Token for a new Access Token.
     */
    async refreshToken(refreshToken: string) {
        // 1. Verify JWT signature & expiration
        let decoded: any;
        try {
            decoded = this.jwtService.verify(refreshToken);
        } catch {
            throw new UnauthorizedException('Refresh token expired or invalid. Please log in again.');
        }

        if (decoded.purpose !== 'refresh') {
            throw new UnauthorizedException('Invalid token purpose.');
        }

        // 2. Validate against Database (ensures it wasn't revoked)
        const storedToken = await this.usersService.findRefreshToken(refreshToken);
        if (!storedToken || storedToken.isRevoked) {
            throw new UnauthorizedException('Refresh token revoked or missing. Please log in again.');
        }

        // 3. Get User to generate new payload
        const user = await this.usersService.findById(decoded.sub);
        if (!user || user.isSuspended) {
            throw new UnauthorizedException('User account is invalid or suspended.');
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        const access_token = this.jwtService.sign(payload);

        return { access_token };
    }

    async register(registerDto: RegisterDto) {
        if (!registerDto.termsAccepted) {
            throw new BadRequestException('You must accept the Terms and Conditions to register.');
        }

        const role = (registerDto.role as any) || 'FREE';

        if (role === 'SELLER' && !registerDto.nationalId) {
            // Deprecated: In Phase 19, National ID is no longer required in step 1.
            // But if it is passed, we can save it. Mock validation is removed.
        }

        let kycStatus = 'UNVERIFIED';

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(registerDto.password, salt);

        const user = await this.usersService.create({
            email: registerDto.email,
            passwordHash,
            fullName: registerDto.fullName,
            role,
            phone: registerDto.phone,
            nationalId: registerDto.nationalId,
            kycStatus,
            termsAcceptedAt: new Date(),
        });

        // Fire & Forget Welcome Email
        this.emailService.sendWelcomeEmail(user.email, (user as any).profile?.fullName || registerDto.fullName, user.role).catch(e => {
            this.logger.error(`Failed to send welcome email to ${user.email}`, e);
        });

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, role: user.role },
        };
    }

    async getProfile(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException();
        const { passwordHash, ...result } = user;
        return result;
    }

    async logout(userId: string) {
        await this.usersService.revokeAllUserRefreshTokens(userId);
        return { message: 'Logged out successfully, all sessions revoked.' };
    }

    async googleLogin(profile: { email: string, name: string, picture?: string, googleId: string }) {
        let existingUser: any = await this.usersService.findByEmail(profile.email);

        let isNewUser = false;
        let finalUser: any;

        if (!existingUser) {
            isNewUser = true;
            // First time Google login
            // Create user with a 'FREE' role. The frontend will prompt them to pick a real role.
            finalUser = await this.usersService.create({
                email: profile.email,
                passwordHash: null,
                googleId: profile.googleId,
                fullName: profile.name,
                role: 'FREE',
                kycStatus: 'UNVERIFIED',
            });

            // Send welcome email
            this.emailService.sendWelcomeEmail(finalUser.email, finalUser.profile?.fullName || profile.name, finalUser.role).catch(e => {
                this.logger.error(`Failed to send welcome email to ${finalUser.email}`, e);
            });
        } else {
            finalUser = existingUser;
        }

        const payload = { email: finalUser.email, sub: finalUser.id, role: finalUser.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: finalUser.id,
                email: finalUser.email,
                role: finalUser.role,
                fullName: finalUser.profile?.fullName || profile.name,
                kycStatus: finalUser.kycStatus,
                isNewGoogleUser: isNewUser // Frontend can check this to display role selection
            },
        };
    }

    async updateRole(userId: string, targetRole: string) {
        // Find user
        const user = await this.usersService.findById(userId);
        if (!user) throw new BadRequestException('User not found');

        // Can only update if currently FREE (meaning they just signed up via Google)
        if (user.role !== 'FREE') {
            return { success: true, message: 'Role already set', user };
        }

        // Must be SELLER or EMPLOYER mostly
        // Update user role in DB
        const updatedUser = await this.usersService.updateRole(userId, targetRole);

        return {
            success: true,
            user: updatedUser
        };
    }

    /**
     * Forgot Password: Generate OTP and send password reset email.
     */
    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            // Don't reveal whether the email exists — always return success
            return { message: 'If an account exists with this email, a reset code has been sent.' };
        }

        // Generate OTP (reuse existing OTP infrastructure with a new type)
        const otp = await this.otpService.generateAndSend(user.email, 'EMAIL_VERIFY');

        // Send dedicated password reset email with the code
        const fullName = (user as any).profile?.fullName || '';
        // The OTP service already sends an email, but we also send a styled one
        // We need to get the actual code — let's query the DB for the latest OTP
        // Actually, the otpService.generateAndSend already sends the code via email.
        // We just return a success message.

        return { message: 'If an account exists with this email, a reset code has been sent.' };
    }

    /**
     * Reset Password: Verify OTP and set new password.
     */
    async resetPassword(email: string, code: string, newPassword: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('Invalid email or code.');
        }

        // Verify OTP
        await this.otpService.verify(email, code, 'EMAIL_VERIFY');

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update password in DB
        await this.usersService.updatePassword(user.id, passwordHash);

        return { message: 'Password has been reset successfully. You can now log in.' };
    }

    /**
     * Change Password: For logged-in users who know their current password.
     */
    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new BadRequestException('User not found');

        if (!user.passwordHash) {
            throw new BadRequestException('Your account uses Google Sign-In. Password change is not available.');
        }

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            throw new BadRequestException('Current password is incorrect.');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        await this.usersService.updatePassword(userId, passwordHash);

        return { message: 'Password changed successfully.' };
    }
}

