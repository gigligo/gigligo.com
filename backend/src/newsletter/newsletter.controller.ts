import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/newsletter')
export class NewsletterController {
    constructor(private prisma: PrismaService) { }

    @Post('subscribe')
    async subscribe(@Body() body: { email: string }) {
        if (!body.email || !body.email.includes('@')) {
            throw new BadRequestException('Valid email is required.');
        }

        const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { email: body.email } });
        if (existing) {
            return { message: 'You are already subscribed!', alreadySubscribed: true };
        }

        await this.prisma.newsletterSubscriber.create({ data: { email: body.email } });
        return { message: 'Successfully subscribed! 🎉', success: true };
    }
}
