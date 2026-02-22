import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private prisma: PrismaService,
    ) { }

    @Get()
    @HealthCheck()
    async check(): Promise<HealthCheckResult> {
        return this.health.check([
            async () => {
                try {
                    await this.prisma.$queryRaw`SELECT 1`;
                    return { database: { status: 'up' } };
                } catch {
                    return { database: { status: 'down' } };
                }
            },
        ]);
    }

    @Get('ping')
    ping() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: '1.0.0',
        };
    }
}
