import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function optimize() {
    const input = path.resolve('public/founder-ali-noman.jpg');
    const targetDir = path.resolve('public/images/hero');

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 1. Move and optimize original as JPG 
    await sharp(input).jpeg({ quality: 80 }).toFile(path.join(targetDir, 'hero.jpg'));

    // 2. Convert to WebP
    await sharp(input).webp({ quality: 80 }).toFile(path.join(targetDir, 'hero.webp'));

    // 3. Generate responsive widths for "feature" images as requested
    // I will also make feature-400, feature-800, feature-1200 as requested
    const widths = [400, 800, 1200];
    for (const w of widths) {
        await sharp(input).resize(w).jpeg({ quality: 80 }).toFile(path.resolve(`public/images/feature-${w}.jpg`));
    }
}

optimize().then(() => console.log('Optimized images generated!')).catch(console.error);
