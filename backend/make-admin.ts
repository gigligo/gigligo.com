import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@gigligo.com';

    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (admin) {
        await prisma.user.update({
            where: { email: adminEmail },
            data: { role: 'ADMIN', kycStatus: 'APPROVED' }
        });
        console.log('User upgraded to ADMIN');
    } else {
        console.log('User not found. Register first.');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
