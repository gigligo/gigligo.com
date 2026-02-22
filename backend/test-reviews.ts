import { PrismaClient } from '@prisma/client';
import { ReviewService } from './src/review/review.service';

const prisma = new PrismaClient();

async function main() {
    const reviewService = new ReviewService(prisma as any);

    // 1. Create a dummy gig seller
    const seller = await prisma.user.create({
        data: {
            email: `seller.${Date.now()}@test.com`,
            passwordHash: 'dummy',
            role: 'SELLER',
            profile: {
                create: { fullName: 'Test Seller' }
            }
        }
    });

    // 2. Create a dummy gig
    const gig = await prisma.gig.create({
        data: {
            sellerId: seller.id,
            title: 'Test Gig for Reviews',
            description: 'Test Description',
            category: 'Tech',
            priceStarter: 5, priceStandard: 10, pricePremium: 20,
            deliveryTimeStarter: 1, deliveryTimeStandard: 2, deliveryTimePremium: 3,
        }
    });

    console.log('Created seller and gig.');

    // 3. Create 5 buyers and 5 completed orders
    for (let i = 1; i <= 5; i++) {
        const buyer = await prisma.user.create({
            data: {
                email: `buyer${i}.${Date.now()}@test.com`,
                passwordHash: 'dummy',
                role: 'BUYER',
                profile: { create: { fullName: `Buyer ${i}` } }
            }
        });

        const order = await prisma.order.create({
            data: {
                buyerId: buyer.id,
                sellerId: seller.id,
                gigId: gig.id,
                packageSelected: 'STARTER',
                price: 5,
                escrowAmount: 5,
                status: 'COMPLETED',
                deadline: new Date(),
            }
        });

        // Submit a 5-star review for each order
        await reviewService.submitReview(buyer.id, {
            orderId: order.id,
            rating: 5,
            comment: `Great work on order ${i}!`
        });
        console.log(`Submitted review for order ${i}`);
    }

    // 4. Check the seller's level updated to LEVEL_1 (because 5 completed orders and 5.0 rating)
    const updatedProfile = await prisma.profile.findUnique({ where: { userId: seller.id } });
    console.log(`\nFinal Seller Level: ${updatedProfile?.sellerLevel}`);

    // Average rating check
    const ratingStats = await prisma.review.aggregate({
        where: { revieweeId: seller.id },
        _avg: { rating: true },
        _count: { rating: true }
    });
    console.log(`Average Rating: ${ratingStats._avg.rating?.toFixed(1)} (${ratingStats._count.rating} reviews)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
