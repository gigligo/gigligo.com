import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GigService {
    constructor(private prisma: PrismaService) { }

    async findAll(queryParams: any) {
        const where: any = { isActive: true };
        if (queryParams.category) where.category = queryParams.category;

        if (queryParams.search) {
            where.OR = [
                { title: { search: queryParams.search.split(' ').join(' | ') } },
                { description: { search: queryParams.search.split(' ').join(' | ') } }
            ];
        }

        // Optimized: use _count instead of loading all review objects
        const now = new Date();
        const gigs = await this.prisma.gig.findMany({
            where,
            include: {
                seller: { select: { id: true, profile: true } },
                _count: { select: { reviews: true } },
                boosts: { where: { expiresAt: { gt: now } } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Sort so that gigs with active boosts appear first
        return gigs
            .map(gig => ({
                ...gig,
                reviewCount: (gig as any)._count.reviews,
            }))
            .sort((a, b) => {
                const aBoosted = a.boosts.length > 0 ? 1 : 0;
                const bBoosted = b.boosts.length > 0 ? 1 : 0;
                return bBoosted - aBoosted;
            });
    }

    async findOne(id: string) {
        const gig = await this.prisma.gig.findUnique({
            where: { id },
            include: {
                seller: { select: { id: true, profile: true } },
                reviews: {
                    include: {
                        reviewer: {
                            select: {
                                profile: { select: { fullName: true, avatarUrl: true } }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                boosts: { where: { expiresAt: { gt: new Date() } } }
            },
        });
        if (!gig) throw new NotFoundException('Gig not found');
        return {
            ...gig,
            reviewCount: gig.reviews.length,
            avgRating: gig.reviews.length > 0 ? gig.reviews.reduce((sum, r) => sum + r.rating, 0) / gig.reviews.length : 0
        };
    }

    async findMine(sellerId: string) {
        return this.prisma.gig.findMany({
            where: { sellerId },
            include: {
                boosts: { where: { expiresAt: { gt: new Date() } } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(sellerId: string, data: any) {
        // KYC check: seller must be verified before creating gigs
        const seller = await this.prisma.user.findUnique({ where: { id: sellerId }, select: { kycStatus: true } });
        if (!seller || seller.kycStatus !== 'APPROVED') {
            throw new BadRequestException('You must complete KYC verification before creating gigs. Go to Dashboard → KYC Verification.');
        }

        return this.prisma.gig.create({
            data: {
                ...data,
                sellerId,
            },
        });
    }

    async update(id: string, sellerId: string, data: any) {
        const gig = await this.prisma.gig.findUnique({ where: { id } });
        if (!gig || gig.sellerId !== sellerId) {
            throw new NotFoundException('Gig not found or you are not the owner');
        }
        return this.prisma.gig.update({
            where: { id },
            data,
        });
    }
}
