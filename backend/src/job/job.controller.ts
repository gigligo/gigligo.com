import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JobService } from './job.service';
import { MatchingEngineService } from './matching.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/jobs')
export class JobController {
    constructor(
        private jobService: JobService,
        private matchingService: MatchingEngineService
    ) { }

    @Get()
    findAll(
        @Query('category') category?: string,
        @Query('search') search?: string,
        @Query('jobType') jobType?: string,
        @Query('budgetMin') budgetMin?: string,
        @Query('budgetMax') budgetMax?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.jobService.findAll({
            category,
            search,
            jobType,
            budgetMin: budgetMin ? +budgetMin : undefined,
            budgetMax: budgetMax ? +budgetMax : undefined,
            page: page ? +page : 1,
            limit: limit ? +limit : 20,
        });
    }

    @Get('mine')
    @UseGuards(JwtAuthGuard)
    getMyJobs(@Req() req: any) {
        return this.jobService.getMyJobs(req.user.id);
    }

    @Get('recommended')
    @UseGuards(JwtAuthGuard)
    getRecommendedJobs(@Req() req: any) {
        return this.matchingService.getRecommendedJobs(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUYER', 'EMPLOYER', 'ADMIN')
    create(@Req() req: any, @Body() body: any) {
        return this.jobService.create(req.user.id, body);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUYER', 'EMPLOYER', 'ADMIN')
    update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.jobService.update(id, req.user.id, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUYER', 'EMPLOYER', 'ADMIN')
    deleteJob(@Req() req: any, @Param('id') id: string) {
        return this.jobService.deleteJob(id, req.user.id);
    }

    @Post(':id/boost')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUYER', 'EMPLOYER', 'ADMIN')
    boost(@Req() req: any, @Param('id') id: string, @Body() body: { durationDays: number; amountPKR: number }) {
        return this.jobService.boostJob(id, req.user.id, body.durationDays, body.amountPKR);
    }
}
