import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Get any active gig
    const gig = await prisma.gig.findFirst({ where: { isActive: true } });
    if (!gig) {
        console.log('No active gig found to test reviews');
        return;
    }

    // 2. Create a test employer
    const email = `test.employer.${Date.now()}@gigligo.com`;
    const buyer = await prisma.user.create({
        data: {
            email,
            passwordHash: 'hashed_password', // mock
            role: 'EMPLOYER',
            kycStatus: 'APPROVED',
            profile: {
                create: {
                    fullName: 'Test Employer Buyer',
                }
            },
            wallet: {
                create: { balancePKR: 100000, pendingPKR: 0 }
            }
        }
    });

    // 3. Create a COMPLETED order
    const order = await prisma.order.create({
        data: {
            buyerId: buyer.id,
            sellerId: gig.sellerId,
            gigId: gig.id,
            packageSelected: 'STANDARD',
            price: 500,
            escrowAmount: 500,
            status: 'COMPLETED',
            deadline: new Date(),
            escrowReleased: true,
            commission: 50,
        }
    });

    // We will leave the review manually from the frontend.
    console.log(`Test environment seeded.
Buyer Email: ${email}
Seller ID: ${gig.sellerId}
Gig ID: ${gig.id}
Order ID: ${order.id}
You can log in to the DB directly to get a token, or login with this user via UI.
Actually, let's just create a token for this buyer manually to test API, or we can use the bypass-password login trick if available. Let's just set the password to a known hash.`);

    // To make login easy, let's update passwordHash to a known one from early testing (Admin12345! hash).
    // The webauthn bypass also requires a password.
    // I'll just change the passwordHash to something easy if I already know a hash, otherwise I'll need to use bcrypt.
    // Instead of bcrypt, let's just write a generic script that uses user service to register if needed.
}

main().catch(console.error).finally(() => prisma.$disconnect());
