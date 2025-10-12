// ensures that critical images are copied to the build output directory
// Usage: node copy-assets.js

import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcImagesDir = resolve(__dirname, 'src', 'assets', 'images');
const publicDir = resolve(__dirname, 'public');
const distDir = resolve(__dirname, 'dist');
const distImagesDir = resolve(distDir, 'src', 'assets', 'images');

function ensureDirectoryExists(dir) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
}

function copyImages() {
    ensureDirectoryExists(distImagesDir);
    const criticalImages = [
        'upwards.webp',
        'profile.webp'
    ];

    criticalImages.forEach(image => {
        try {
            const src = resolve(srcImagesDir, image);
            const dest = resolve(distImagesDir, image);
            copyFileSync(src, dest);
            console.log(`Copied: ${image} to ${dest}`);
        } catch (err) {
            console.error(`Error copying ${image}: ${err.message}`);
        }
    });

    try {
        const previewSrc = resolve(srcImagesDir, 'profile.webp');
        const previewDest = resolve(distDir, 'preview-image.jpg');
        copyFileSync(previewSrc, previewDest);
        console.log('Created preview image for social media sharing');
    } catch (err) {
        console.error(`Error creating preview image: ${err.message}`);
    }

    try {
        const faviconSrc = resolve(publicDir, 'favicon.ico');
        const faviconDest = resolve(distDir, 'favicon.ico');
        if (existsSync(faviconSrc)) {
            copyFileSync(faviconSrc, faviconDest);
            console.log('Copied favicon.ico to build directory');
        } else {
            console.log('No favicon.ico found in public directory');
        }
    } catch (err) {
        console.error(`Error copying favicon: ${err.message}`);
    }
}

console.log("Starting asset copy process...");
copyImages();
console.log("Asset copy complete!!");
