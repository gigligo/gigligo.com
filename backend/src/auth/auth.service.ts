import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { KycService } from '../kyc/kyc.service';
import { EmailService } from '../email/email.service';
import { OtpService } from '../otp/otp.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const rpName = 'Gigligo Platform';
// HARDCODED: Never rely on NODE_ENV which Render doesn't set by default
const rpID = 'gigligo.com';
const origin = ['https://gigligo.com', 'https://www.gigligo.com', 'http://localhost:3000'];

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

        // OTP valid — issue full access token
        const user = await this.usersService.findByEmail(decoded.email);
        if (!user) throw new UnauthorizedException();

        const payload = { email: user.email, sub: user.id, role: user.role };
        const { passwordHash, ...safeUser } = user;

        return {
            access_token: this.jwtService.sign(payload),
            user: safeUser,
        };
    }

    /**
     * Resend OTP for a login attempt (uses the temp token to identify the user).
     */
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

    // ═══════════════════════════════════════
    // WEBAUTHN (Biometric) LOGIC
    // ═══════════════════════════════════════

    async getWebAuthnRegistrationOptions(userReq: any) {
        const user = await this.usersService.findById(userReq.id);
        if (!user) throw new UnauthorizedException('User not found');

        const userPasskeys = await this.usersService.getUserCredentials(user.id);

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userName: user.email,
            userDisplayName: user.profile?.fullName || user.email,
            attestationType: 'none',
            excludeCredentials: userPasskeys.map(passkey => ({
                id: passkey.credentialID,
                type: 'public-key',
                transports: passkey.transports ? JSON.parse(passkey.transports) : [],
            })),
            authenticatorSelection: {
                residentKey: 'required',
                userVerification: 'preferred',
            },
        });

        await this.usersService.updateChallenge(user.id, options.challenge);
        return options;
    }

    async verifyWebAuthnRegistration(userReq: any, body: any) {
        const user = await this.usersService.findById(userReq.id);
        if (!user || !user.currentChallenge) throw new BadRequestException('Validation failed');

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: body,
                expectedChallenge: user.currentChallenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
            });
        } catch (error: any) {
            this.logger.error(`WebAuthn verifyRegistrationResponse failed: ${error.message}`);
            throw new BadRequestException(`Registration validation failed: ${error.message}`);
        }

        if (verification.verified && verification.registrationInfo) {
            const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

            await this.usersService.saveWebAuthnCredential(user.id, {
                credentialID: credential.id,
                credentialPublicKey: Buffer.from(credential.publicKey),
                counter: credential.counter,
                credentialDeviceType,
                credentialBackedUp,
                transports: body.response.transports,
            });
            await this.usersService.updateChallenge(user.id, null);
            return { verified: true };
        }
        throw new BadRequestException('Registration failed');
    }

    async getWebAuthnAuthenticationOptions(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            // Prevent username enumeration by returning generic options
            return generateAuthenticationOptions({ rpID, userVerification: 'preferred' });
        }

        const options = await generateAuthenticationOptions({
            rpID,
            userVerification: 'preferred',
        });

        await this.usersService.updateChallenge(user.id, options.challenge);
        return options;
    }

    async verifyWebAuthnAuthentication(email: string, body: any) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.currentChallenge) throw new UnauthorizedException('Invalid generic challenge');

        const authenticator = await this.usersService.getWebAuthnCredential(body.id);
        if (!authenticator || authenticator.user.id !== user.id) {
            throw new UnauthorizedException('Authenticator not registered for this user');
        }

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: body,
                expectedChallenge: user.currentChallenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
                credential: {
                    id: authenticator.credentialID,
                    publicKey: new Uint8Array(authenticator.credentialPublicKey),
                    counter: Number(authenticator.counter),
                    transports: authenticator.transports ? JSON.parse(authenticator.transports) : undefined,
                },
            });
        } catch (error: any) {
            this.logger.error(`WebAuthn verifyAuthenticationResponse failed: ${error.message}`);
            throw new UnauthorizedException(`Authentication validation failed: ${error.message}`);
        }

        if (verification.verified && verification.authenticationInfo) {
            await this.usersService.updateCredentialCounter(authenticator.credentialID, verification.authenticationInfo.newCounter);
            await this.usersService.updateChallenge(user.id, null);

            const payload = { email: user.email, sub: user.id, role: user.role };
            const { passwordHash, ...safeUser } = user;
            return {
                verified: true,
                access_token: this.jwtService.sign(payload),
                user: { ...safeUser },
            };
        }
        throw new BadRequestException('Authentication failed');
    }

    // --- WebAuthn Autofill (Conditional UI) ---

    async getWebAuthnAutofillOptions() {
        const options = await generateAuthenticationOptions({
            rpID,
            userVerification: 'preferred',
        });

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const challengeRec = await this.usersService.saveAuthChallenge(options.challenge, expiresAt);

        return {
            options,
            sessionId: challengeRec.id,
        };
    }

    async verifyWebAuthnAutofill(sessionId: string, body: any) {
        const challengeRec = await this.usersService.getAuthChallenge(sessionId);
        if (!challengeRec) throw new UnauthorizedException('Challenge expired or invalid');

        await this.usersService.deleteAuthChallenge(sessionId);

        const authenticator = await this.usersService.getWebAuthnCredential(body.id);
        if (!authenticator) throw new UnauthorizedException('Authenticator not registered');

        const user = authenticator.user;
        if (!user) throw new UnauthorizedException('User not found');

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: body,
                expectedChallenge: challengeRec.challenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
                credential: {
                    id: authenticator.credentialID,
                    publicKey: new Uint8Array(authenticator.credentialPublicKey),
                    counter: Number(authenticator.counter),
                    transports: authenticator.transports ? JSON.parse(authenticator.transports) : undefined,
                },
            });
        } catch (error: any) {
            this.logger.error(`WebAuthn verifyAutofill failed: ${error.message}`);
            throw new UnauthorizedException(`Authentication validation failed: ${error.message}`);
        }

        if (verification.verified && verification.authenticationInfo) {
            await this.usersService.updateCredentialCounter(authenticator.credentialID, verification.authenticationInfo.newCounter);

            const payload = { email: user.email, sub: user.id, role: user.role };
            const { passwordHash, ...safeUser } = user;
            return {
                verified: true,
                access_token: this.jwtService.sign(payload),
                user: { ...safeUser },
            };
        }
        throw new BadRequestException('Authentication failed');
    }
}
