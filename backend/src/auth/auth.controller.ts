import { Controller, Post, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TwoFactorService } from './twoFactor.service';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private twoFactorService: TwoFactorService
    ) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        return this.authService.getProfile(req.user.id);
    }

    // ═══════════════════════════════════════
    // WEBAUTHN ENDPOINTS
    // ═══════════════════════════════════════

    @UseGuards(JwtAuthGuard)
    @Get('webauthn/register/options')
    async getWebAuthnRegisterOptions(@Req() req: any) {
        return this.authService.getWebAuthnRegistrationOptions(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('webauthn/register/verify')
    async verifyWebAuthnRegistration(@Req() req: any, @Body() body: any) {
        return this.authService.verifyWebAuthnRegistration(req.user, body);
    }

    @Post('webauthn/login/options')
    async getWebAuthnLoginOptions(@Body('email') email: string) {
        return this.authService.getWebAuthnAuthenticationOptions(email);
    }

    @Post('webauthn/login/verify')
    async verifyWebAuthnLogin(@Body() requestBody: { email: string; response: any }) {
        return this.authService.verifyWebAuthnAuthentication(requestBody.email, requestBody.response);
    }

    @Post('webauthn/autofill/options')
    async getWebAuthnAutofillOptions() {
        return this.authService.getWebAuthnAutofillOptions();
    }

    @Post('webauthn/autofill/verify')
    async verifyWebAuthnAutofill(@Body() requestBody: { sessionId: string; response: any }) {
        return this.authService.verifyWebAuthnAutofill(requestBody.sessionId, requestBody.response);
    }

    // ═══════════════════════════════════════
    // GOOGLE AUTH
    // ═══════════════════════════════════════

    @Post('google/callback')
    async googleCallback(@Body() body: { email: string, name: string, picture?: string, googleId: string }) {
        return this.authService.googleLogin(body);
    }

    @UseGuards(JwtAuthGuard)
    @Put('role')
    async updateRole(@Req() req: any, @Body() body: { role: string }) {
        // Normally handled by UsersService, we can inject and use it directly or via AuthService
        return this.authService.updateRole(req.user.id, body.role);
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
