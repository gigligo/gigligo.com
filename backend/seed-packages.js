const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.creditPackage.createMany({
    data: [
      { name: 'Starter Bundle', credits: 25, pricePKR: 5000, isActive: true },
      { name: 'Professional Bundle', credits: 60, pricePKR: 10000, isActive: true },
      { name: 'Agency Bundle', credits: 150, pricePKR: 20000, isActive: true }
    ],
    skipDuplicates: true
  });
  console.log('Packages seeded successfully');
}

main().finally(() => prisma.$disconnect());
