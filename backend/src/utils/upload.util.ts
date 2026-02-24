import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Logger } from '@nestjs/common';

const logger = new Logger('StorageUtil');

if (process.env.CLOUDINARY_URL) {
    logger.log('Cloudinary initialized for uploads');
} else {
    logger.warn('CLOUDINARY_URL missing, falling back to local disk storage');
}

/**
 * Returns a Multer storage engine (either S3 or Local Disk)
 * @param {string} localSubfolder The subfolder in `./uploads/` if using local disk
 * @param {string} s3Prefix The prefix folder in S3 bucket if using S3
 */
export const getStorageOptions = (localSubfolder: string, s3Prefix: string) => {
    if (process.env.CLOUDINARY_URL) {
        // Use Cloudinary
        return new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: `gigligo/${s3Prefix}`,
                resource_type: 'auto',
            } as any,
        });
    } else {
        // Use Local Disk
        const uploadPath = `./uploads/${localSubfolder}`;
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        return diskStorage({
            destination: uploadPath,
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            }
        });
    }
};

/**
 * Normalizes the file URL for the frontend.
 * If the file is from S3, it returns the Location URL directly.
 * If local, it prepends `/uploads/...` 
 */
export const getFileUrl = (file: any, localSubfolder: string) => {
    if (file.path && file.path.includes('cloudinary.com')) {
        // Cloudinary file
        return file.path;
    }
    if (file.location) {
        // Fallback for S3 if any old usage exists (optional)
        return file.location;
    }
    // Local file
    return `/uploads/${localSubfolder}/${file.filename}`;
};
