import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start without it.');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: { sub: string; email: string }) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        // Strip sensitive fields — never expose to downstream handlers
        const { passwordHash, twoFactorSecret, ...safeUser } = user as any;
        // Block suspended users at the JWT level
        if (safeUser.isSuspended) {
            throw new UnauthorizedException('Your account has been suspended. Contact support.');
        }
        return safeUser;
    }
}
