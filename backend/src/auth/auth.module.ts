import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { KycModule } from '../kyc/kyc.module';
import { EmailModule } from '../email/email.module';
import { OtpModule } from '../otp/otp.module';
import { TwoFactorService } from './twoFactor.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    UsersModule,
    KycModule,
    EmailModule,
    OtpModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, TwoFactorService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, TwoFactorService],
})
export class AuthModule { }
