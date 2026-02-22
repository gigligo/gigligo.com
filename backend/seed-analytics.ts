import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Get the seller we created earlier for review testing (or any seller with a gig)
    const seller = await prisma.user.findFirst({
        where: { email: { startsWith: 'seller.' } },
        include: { gigs: true }
    });

    if (!seller || seller.gigs.length === 0) {
        console.log('No suitable seller found. Please run test-reviews.ts first.');
        return;
    }

    const gig = seller.gigs[0];

    // 2. We'll create 15 completed orders spread over the last 30 days
    const now = new Date();

    for (let i = 0; i < 15; i++) {
        // Random day between 1 and 28 days ago
        const daysAgo = Math.floor(Math.random() * 28) + 1;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() - daysAgo);

        // Random price
        const price = Math.floor(Math.random() * 50) * 100 + 500; // 500 to 5500

        await prisma.order.create({
            data: {
                buyerId: seller.id, // Just using seller as buyer for dummy constraints
                sellerId: seller.id,
                gigId: gig.id,
                packageSelected: 'STANDARD',
                price: price,
                escrowAmount: price,
                status: 'COMPLETED',
                deadline: targetDate,
                updatedAt: targetDate, // The most important field for analytics
            }
        });
        console.log(`Created historical order: PKR ${price} on ${targetDate.toISOString().split('T')[0]}`);
    }

    console.log('\nHistorical data seeded successfully! Seller ID: ', seller.id);
    console.log('You can log in / get token for this user to view their analytics chart.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
