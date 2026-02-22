import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async submitReview(
        @Req() req: Request & { user: { userId: string } },
        @Body() body: { orderId: string; rating: number; comment: string }
    ) {
        return this.reviewService.submitReview(req.user.userId, body);
    }

    @Get('gig/:gigId')
    async getGigReviews(@Param('gigId') gigId: string) {
        return this.reviewService.getGigReviews(gigId);
    }

    @Get('seller/:sellerId')
    async getSellerReviews(@Param('sellerId') sellerId: string) {
        return this.reviewService.getSellerReviews(sellerId);
    }
}
