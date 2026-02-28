import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchingEngineService {
    constructor(private prisma: PrismaService) { }

    async getRecommendedJobs(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        });

        if (!user || !user.profile) return [];

        const { skills, hourlyRate, sellerLevel } = user.profile;

        // Fetch open jobs
        const jobs = await this.prisma.job.findMany({
            where: { status: 'OPEN' },
            include: { employer: { select: { isFoundingMember: true } } }
        });

        const scoredJobs = jobs.map(job => {
            let score = 0;

            // 1. Skills overlap (max 50 points)
            const jobSkills = job.tags || [];
            if (jobSkills.length > 0 && skills.length > 0) {
                const lowerSkills = skills.map(s => s.toLowerCase());
                const matchCount = jobSkills.filter(s => lowerSkills.includes(s.toLowerCase())).length;
                score += (matchCount / Math.max(jobSkills.length, 1)) * 50;
            } else if (skills.length === 0) {
                // If user has no skills listed, default to lowest score to encourage profile completion
                score += 5;
            }

            // 2. Budget match (max 30 points)
            if (hourlyRate) {
                // Project scale conversion (assume a standard project takes 10-40 hours for budget estimation)
                // We'll roughly estimate matching using pure hourly vs budget logic if exact bounds are missing
                const estimatedProjectValue = hourlyRate * 20;
                if (estimatedProjectValue >= job.budgetMin && estimatedProjectValue <= job.budgetMax) {
                    score += 30;
                } else if (estimatedProjectValue < job.budgetMin) {
                    score += 20; // Affordable for employer
                } else if (estimatedProjectValue > job.budgetMax && estimatedProjectValue <= job.budgetMax * 1.5) {
                    score += 10; // Reachable
                }
            } else {
                score += 15;
            }

            // 3. User Level Boost (max 10 points)
            if (sellerLevel === 'TOP_RATED') score += 10;
            else if (sellerLevel === 'LEVEL_2') score += 7;
            else if (sellerLevel === 'LEVEL_1') score += 4;

            // 4. Founding Member Employer Boost (max 10 points)
            if (job.employer.isFoundingMember) {
                score += 10;
            }

            // 5. Job Advertisement Boost (Bonus +20 points)
            if (job.isBoosted && job.boostExpiry && job.boostExpiry > new Date()) {
                score += 20;
            }

            return { ...job, matchScore: Math.min(Math.round(score), 100) };
        });

        // Filter and sort by descending
        return scoredJobs
            .filter(j => j.matchScore >= 20 || (j.isBoosted && j.boostExpiry && j.boostExpiry > new Date()))
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5);
    }
}
