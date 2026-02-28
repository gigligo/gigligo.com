import { Controller, Post, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { TwoFactorService } from './twoFactor.service';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private twoFactorService: TwoFactorService
    ) { }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('login/verify-otp')
    async verifyLoginOtp(@Body() body: { tempToken: string; code: string }) {
        return this.authService.verifyLoginOtp(body.tempToken, body.code);
    }

    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post('otp/resend')
    async resendOtp(@Body() body: { tempToken: string }) {
        return this.authService.resendLoginOtp(body.tempToken);
    }

    @Post('refresh')
    async refresh(@Body() body: { refresh_token: string }) {
        return this.authService.refreshToken(body.refresh_token);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: any) {
        return this.authService.logout(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        return this.authService.getProfile(req.user.id);
    }



    // ═══════════════════════════════════════
    // GOOGLE AUTH
    // ═══════════════════════════════════════

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post('google/callback')
    async googleCallback(@Body() body: { credential: string }) {
        // Verify the Google ID token server-side before trusting any claims
        if (!body.credential) {
            throw new Error('Missing Google credential token');
        }

        // Validate token via Google's tokeninfo endpoint
        const googleRes = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(body.credential)}`
        );
        if (!googleRes.ok) {
            throw new Error('Invalid Google token — verification failed');
        }
        const googleProfile = await googleRes.json();

        // Ensure the token was issued for our client ID
        const expectedClientId = process.env.GOOGLE_CLIENT_ID;
        if (expectedClientId && googleProfile.aud !== expectedClientId) {
            throw new Error('Google token audience mismatch — potential forgery');
        }

        return this.authService.googleLogin({
            email: googleProfile.email,
            name: googleProfile.name || googleProfile.email.split('@')[0],
            picture: googleProfile.picture,
            googleId: googleProfile.sub,
        });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Put('role')
    async updateRole(@Req() req: any, @Body() body: { userId: string; role: string }) {
        // ADMIN-only: change another user's role
        return this.authService.updateRole(body.userId, body.role);
    }

    // ═══════════════════════════════════════
    // PASSWORD RESET (Public)
    // ═══════════════════════════════════════

    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post('forgot-password')
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
        return this.authService.resetPassword(body.email, body.code, body.newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Req() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
        return this.authService.changePassword(req.user.id, body.currentPassword, body.newPassword);
    }

    // ═══════════════════════════════════════
    // TWO-FACTOR AUTHENTICATION (2FA)
    // ═══════════════════════════════════════

    @UseGuards(JwtAuthGuard)
    @Post('2fa/generate')
    async generateTwoFactorSecret(@Req() req: any) {
        return this.twoFactorService.generateSecret(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('2fa/verify')
    async verifyTwoFactor(@Req() req: any, @Body() body: { code: string }) {
        return this.twoFactorService.verifyCodeAndEnable(req.user.id, body.code);
    }

    @UseGuards(JwtAuthGuard)
    @Post('2fa/disable')
    async disableTwoFactor(@Req() req: any, @Body() body: { code: string }) {
        return this.twoFactorService.disable(req.user.id, body.code);
    }
}
