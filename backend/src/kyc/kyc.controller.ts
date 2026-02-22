import { Controller, Get, Post, UseGuards, Request, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getStorageOptions, getFileUrl } from '../utils/upload.util';

@Controller('api/kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
    constructor(private readonly kycService: KycService) { }

    @Post('submit')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'selfie', maxCount: 1 },
        { name: 'cnicFront', maxCount: 1 },
        { name: 'cnicBack', maxCount: 1 },
    ], {
        storage: getStorageOptions('kyc', 'kyc'),
    }))
    submitKyc(@Request() req: any, @UploadedFiles() files: { selfie?: Express.Multer.File[], cnicFront?: Express.Multer.File[], cnicBack?: Express.Multer.File[] }) {
        if (!files.selfie || !files.cnicFront || !files.cnicBack) {
            throw new BadRequestException('All three KYC documents (Selfie, ID Front, ID Back) are required.');
        }

        const data = {
            selfieUrl: getFileUrl(files.selfie[0], 'kyc'),
            cnicFrontUrl: getFileUrl(files.cnicFront[0], 'kyc'),
            cnicBackUrl: getFileUrl(files.cnicBack[0], 'kyc'),
        };

        return this.kycService.submitKyc(req.user.id, data);
    }

    @Get('status')
    getKycStatus(@Request() req: any) {
        return this.kycService.getKycStatus(req.user.id);
    }
}
