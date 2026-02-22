import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        const adminUser = await prisma.user.findUnique({
            where: { email: 'admin@gigligo.com' }
        });

        const passwordHash = await bcrypt.hash('Admin12345!', 10);

        if (!adminUser) {
            await prisma.user.create({
                data: {
                    email: 'admin@gigligo.com',
                    passwordHash,
                    role: 'ADMIN',
                    kycStatus: 'APPROVED',
                    profile: {
                        create: {
                            fullName: 'System Admin',
                        }
                    }
                }
            });
            console.log('Admin user created successfully.');
        } else {
            // Force update existing
            await prisma.user.update({
                where: { email: 'admin@gigligo.com' },
                data: { passwordHash, role: 'ADMIN', kycStatus: 'APPROVED' }
            });
            console.log('Admin user updated successfully.');
        }

    } catch (e) {
        console.error('Error creating admin user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
