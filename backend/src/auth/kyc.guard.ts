import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * KYC Guard — blocks any protected action if the user's KYC is not APPROVED.
 * Apply this guard to controllers/routes that require verified identity.
 *
 * Usage:
 *   @UseGuards(JwtAuthGuard, KycGuard)
 *   @Post('some-action')
 */
@Injectable()
export class KycGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Authentication required.');
        }

        // Admins and support bypass KYC check
        if (user.role === 'ADMIN' || user.role === 'SUPPORT') {
            return true;
        }

        if (user.kycStatus !== 'APPROVED') {
            throw new ForbiddenException(
                'Your identity has not been verified yet. Please complete KYC verification before performing this action.',
            );
        }

        return true;
    }
}
