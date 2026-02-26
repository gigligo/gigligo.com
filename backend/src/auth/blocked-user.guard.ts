import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Global guard that blocks suspended users from accessing any protected endpoint.
 * Applied globally via APP_GUARD in app.module.ts.
 * 
 * This guard runs AFTER JwtAuthGuard, so req.user is already populated.
 * For routes without JwtAuthGuard (public routes), this guard passes through.
 */
@Injectable()
export class BlockedUserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Public routes (no JWT guard) don't have a user — allow
        if (!user) return true;

        if (user.isSuspended) {
            throw new ForbiddenException(
                'Your account has been suspended. You cannot perform this action. Contact support@gigligo.com for assistance.'
            );
        }

        return true;
    }
}
