import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/applications')
export class ApplicationController {
    constructor(private applicationService: ApplicationService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SELLER', 'STUDENT', 'FREE')
    apply(@Req() req: any, @Body() body: { jobId: string; coverLetter: string; proposedRate?: number; timeline?: string }) {
        return this.applicationService.apply(req.user.id, body);
    }

    @Get('mine')
    @UseGuards(JwtAuthGuard)
    getMyApplications(@Req() req: any) {
        return this.applicationService.getMyApplications(req.user.id);
    }

    @Get('job/:jobId')
    @UseGuards(JwtAuthGuard)
    getApplicationsForJob(@Req() req: any, @Param('jobId') jobId: string) {
        return this.applicationService.getApplicationsForJob(jobId, req.user.id);
    }

    @Patch(':id/hire')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUYER', 'EMPLOYER', 'ADMIN')
    hire(@Req() req: any, @Param('id') id: string) {
        return this.applicationService.hire(id, req.user.id);
    }

    @Patch(':id/shortlist')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUYER', 'EMPLOYER', 'ADMIN')
    shortlist(@Req() req: any, @Param('id') id: string) {
        return this.applicationService.shortlist(id, req.user.id);
    }

    @Patch(':id/reject')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUYER', 'EMPLOYER', 'ADMIN')
    reject(@Req() req: any, @Param('id') id: string) {
        return this.applicationService.reject(id, req.user.id);
    }

    @Patch(':id/withdraw')
    @UseGuards(JwtAuthGuard)
    withdraw(@Req() req: any, @Param('id') id: string) {
        return this.applicationService.withdraw(id, req.user.id);
    }
}
