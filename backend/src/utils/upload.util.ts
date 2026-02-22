import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';

// S3 Client Initialization (Lazy)
let s3Client: S3Client | null = null;
if (process.env.AWS_S3_BUCKET && process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    console.log('[Storage] AWS S3 initialized for uploads');
} else {
    console.log('[Storage] AWS S3 credentials missing, falling back to local disk storage');
}

/**
 * Returns a Multer storage engine (either S3 or Local Disk)
 * @param {string} localSubfolder The subfolder in `./uploads/` if using local disk
 * @param {string} s3Prefix The prefix folder in S3 bucket if using S3
 */
export const getStorageOptions = (localSubfolder: string, s3Prefix: string) => {
    if (s3Client && process.env.AWS_S3_BUCKET) {
        // Use AWS S3
        return multerS3({
            s3: s3Client,
            bucket: process.env.AWS_S3_BUCKET,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${s3Prefix}/${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            }
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
    if (file.location) {
        // S3 file
        return file.location;
    }
    // Local file
    return `/uploads/${localSubfolder}/${file.filename}`;
};
