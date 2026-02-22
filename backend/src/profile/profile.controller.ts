import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getStorageOptions, getFileUrl } from '../utils/upload.util';

@Controller('api/profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req: any) {
        return this.profileService.getProfile(req.user.id);
    }

    @Put('me')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Request() req: any, @Body() body: any) {
        return this.profileService.updateProfile(req.user.id, body);
    }

    // Public Profile
    @Get('public/:id')
    getPublicProfile(@Param('id') id: string) {
        return this.profileService.getPublicProfile(id);
    }

    // Experience
    @Post('experience')
    @UseGuards(JwtAuthGuard)
    addExperience(@Request() req: any, @Body() body: any) {
        return this.profileService.addExperience(req.user.id, body);
    }

    @Put('experience/:id')
    @UseGuards(JwtAuthGuard)
    updateExperience(@Request() req: any, @Param('id') id: string, @Body() body: any) {
        return this.profileService.updateExperience(req.user.id, id, body);
    }

    @Delete('experience/:id')
    @UseGuards(JwtAuthGuard)
    deleteExperience(@Request() req: any, @Param('id') id: string) {
        return this.profileService.deleteExperience(req.user.id, id);
    }

    // Education
    @Post('education')
    @UseGuards(JwtAuthGuard)
    addEducation(@Request() req: any, @Body() body: any) {
        return this.profileService.addEducation(req.user.id, body);
    }

    @Put('education/:id')
    @UseGuards(JwtAuthGuard)
    updateEducation(@Request() req: any, @Param('id') id: string, @Body() body: any) {
        return this.profileService.updateEducation(req.user.id, id, body);
    }

    @Delete('education/:id')
    @UseGuards(JwtAuthGuard)
    deleteEducation(@Request() req: any, @Param('id') id: string) {
        return this.profileService.deleteEducation(req.user.id, id);
    }

    // Portfolio
    @Post('portfolio')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: getStorageOptions('portfolio', 'portfolio'),
    }))
    addPortfolioItem(@Request() req: any, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
        const data = { ...body };
        if (file) {
            data.imageUrl = getFileUrl(file, 'portfolio');
        }
        return this.profileService.addPortfolioItem(req.user.id, data);
    }

    @Put('portfolio/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: getStorageOptions('portfolio', 'portfolio'),
    }))
    updatePortfolioItem(@Request() req: any, @Param('id') id: string, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
        const data = { ...body };
        if (file) {
            data.imageUrl = getFileUrl(file, 'portfolio');
        }
        return this.profileService.updatePortfolioItem(req.user.id, id, data);
    }

    @Delete('portfolio/:id')
    @UseGuards(JwtAuthGuard)
    deletePortfolioItem(@Request() req: any, @Param('id') id: string) {
        return this.profileService.deletePortfolioItem(req.user.id, id);
    }
}
