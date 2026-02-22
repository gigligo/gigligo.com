const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient();

    const email = 'admin@gigligo.com';
    const password = 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        // Update role to ADMIN
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
        console.log(`✅ Updated existing user ${email} to ADMIN role`);
    } else {
        // Create new admin user
        await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: 'ADMIN',
                credits: 0,
                isFoundingMember: false,
                profile: {
                    create: {
                        fullName: 'Admin',
                    },
                },
                wallet: {
                    create: {
                        balancePKR: 0,
                        pendingPKR: 0,
                    },
                },
            },
        });
        console.log(`✅ Created ADMIN user: ${email}`);
    }

    console.log('\n📋 Admin Login Credentials:');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 Login at: http://localhost:3000/login');
    console.log('🔗 Admin Dashboard: http://localhost:3000/admin');

    await prisma.$disconnect();
}

main().catch(console.error);
