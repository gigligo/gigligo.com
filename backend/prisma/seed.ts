import { PrismaClient, Role, JobType, KYCStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clean up existing demo data to prevent duplicates (optional, based on email)
    await prisma.user.deleteMany({
        where: { email: { endsWith: '@demo.com' } }
    });

    const passwordHash = await bcrypt.hash('Password123!', 10);

    // 1. Create Demo Users (Clients & Freelancers)
    const client1 = await prisma.user.create({
        data: {
            email: 'client1@demo.com',
            passwordHash,
            role: Role.BUYER,
            isFoundingMember: true,
            profile: {
                create: { fullName: 'Ali Tech Solutions', bio: 'Tech Startup Founder', location: 'Lahore, Pakistan' }
            }
        }
    });

    const client2 = await prisma.user.create({
        data: {
            email: 'client2@demo.com',
            passwordHash,
            role: Role.BUYER,
            profile: {
                create: { fullName: 'Fatima Marketing', bio: 'Digital Agency', location: 'Karachi, Pakistan' }
            }
        }
    });

    const freelancer1 = await prisma.user.create({
        data: {
            email: 'dev@demo.com',
            passwordHash,
            role: Role.SELLER,
            kycStatus: KYCStatus.APPROVED,
            isFoundingMember: true,
            profile: {
                create: {
                    fullName: 'Muhammad Usman',
                    location: 'Islamabad, Pakistan',
                    bio: 'Full Stack React & Node.js Developer. I build fast, scalable, and secure web applications using the MERN stack and Next.js. 4+ years of experience.',
                    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS']
                }
            }
        }
    });

    const freelancer2 = await prisma.user.create({
        data: {
            email: 'design@demo.com',
            passwordHash,
            role: Role.SELLER,
            kycStatus: KYCStatus.APPROVED,
            profile: {
                create: {
                    fullName: 'Ayesha Khan',
                    location: 'Lahore, Pakistan',
                    bio: 'UI/UX Designer & Brand Strategist. Creating beautiful, user-centric designs that convert. Expert in Figma and Adobe Creative Suite.',
                    skills: ['UI/UX Design', 'Figma', 'Web Design', 'Branding']
                }
            }
        }
    });

    console.log('✅ Created demo users');

    // 2. Create Demo Gigs (Offered by Freelancers)
    await prisma.gig.createMany({
        data: [
            {
                sellerId: freelancer1.id,
                title: 'I will build a modern Next.js 14 website with Tailwind CSS',
                description: 'Get a blazing fast, SEO-optimized, and fully responsive website built with the latest Next.js 14 app router and Tailwind CSS. Perfect for startups and portfolios.',
                category: 'Web Development',
                priceStarter: 25000,
                priceStandard: 50000,
                pricePremium: 100000,
                deliveryTimeStarter: 5,
                deliveryTimeStandard: 10,
                deliveryTimePremium: 15,
            },
            {
                sellerId: freelancer1.id,
                title: 'I will develop a secure Node.js REST API',
                description: 'Robust backend development using Node.js, Express/NestJS, and PostgreSQL/MongoDB. Includes JWT authentication and Swagger documentation.',
                category: 'Web Development',
                priceStarter: 40000,
                priceStandard: 80000,
                pricePremium: 150000,
                deliveryTimeStarter: 7,
                deliveryTimeStandard: 14,
                deliveryTimePremium: 21,
            },
            {
                sellerId: freelancer2.id,
                title: 'I will design a modern UI/UX for your mobile app in Figma',
                description: 'Pixel-perfect, user-friendly mobile app design (iOS & Android). Includes wireframes, high-fidelity mockups, and interactive prototypes.',
                category: 'Design',
                priceStarter: 15000,
                priceStandard: 30000,
                pricePremium: 60000,
                deliveryTimeStarter: 4,
                deliveryTimeStandard: 8,
                deliveryTimePremium: 12,
            },
            {
                sellerId: freelancer2.id,
                title: 'I will create a complete brand identity and logo',
                description: 'Stand out with a unique brand identity. Includes primary logo, secondary logo, color palette, typography guidelines, and social media kit.',
                category: 'Design',
                priceStarter: 20000,
                priceStandard: 40000,
                pricePremium: 80000,
                deliveryTimeStarter: 6,
                deliveryTimeStandard: 10,
                deliveryTimePremium: 14,
            }
        ]
    });

    console.log('✅ Created demo gigs');

    // 3. Create Demo Jobs (Posted by Clients)
    await prisma.job.createMany({
        data: [
            {
                employerId: client1.id,
                title: 'Need a React Native Developer for E-commerce App',
                description: 'We are looking for an experienced React Native developer to build a cross-platform e-commerce app. Must have experience with Redux and Stripe integration.\n\nRequirements:\n- 2+ years React Native experience\n- Portfolio of published apps\n- Good communication skills',
                category: 'Mobile Apps',
                jobType: JobType.REMOTE,
                budgetMin: 50000,
                budgetMax: 100000,
                tags: ['React Native', 'Redux', 'Stripe'],
            },
            {
                employerId: client1.id,
                title: 'SEO Specialist Needed for Tech Blog',
                description: 'Looking for an SEO expert to optimize our tech blog. Need to improve organic traffic, optimize existing articles, and build high-quality backlinks.',
                category: 'Marketing',
                jobType: JobType.REMOTE,
                budgetMin: 1000,
                budgetMax: 3000,
                tags: ['SEO', 'Content Strategy', 'Link Building'],
            },
            {
                employerId: client2.id,
                title: 'Looking for a Video Editor for YouTube Shorts',
                description: 'Need a creative video editor to transform our long-form podcast episodes into engaging 60-second YouTube Shorts/TikToks/Reels. Must know how to add captions, B-roll, and sound effects.',
                category: 'Video',
                jobType: JobType.REMOTE,
                budgetMin: 5000,
                budgetMax: 15000,
                tags: ['Premiere Pro', 'Video Editing', 'Social Media'],
            },
            {
                employerId: client2.id,
                title: 'Copywriter for Landing Page Conversion Optimization',
                description: 'Our SaaS landing page is getting traffic but not converting. We need a direct response copywriter to rewrite the headline, value proposition, and CTA sections.',
                category: 'Writing',
                jobType: JobType.REMOTE,
                budgetMin: 20000,
                budgetMax: 40000,
                tags: ['Copywriting', 'Conversion Rate Optimization', 'Sales Copy'],
            }
        ]
    });

    console.log('✅ Created demo jobs');
    console.log('🌱 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
