import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.user.create({
            data: {
                email: "test.direct@example.com",
                passwordHash: "dummyHash",
                role: "SELLER",
                credits: 25,
                isFoundingMember: true,
                kycStatus: "UNVERIFIED",
                termsAcceptedAt: new Date(),
                profile: {
                    create: {
                        fullName: "Test User",
                        foundingMemberType: "Freelancer"
                    }
                },
                wallet: {
                    create: {
                        balancePKR: 0,
                        pendingPKR: 0
                    }
                }
            }
        });
        console.log("Success!");
    } catch (e) {
        console.error("PRISMA ERROR:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
