const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define image sizes
const sizes = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024
};

// Source images to optimize
const imagesToOptimize = [
  {
    source: 'public/upwards.png',
    destination: 'public/images',
    filename: 'logo',
    maxWidth: 180 // Based on your displayed dimensions
  },
  {
    source: 'public/profile.jpg',
    destination: 'public/images/profile',
    filename: 'profile',
    maxWidth: 320 // Based on your displayed dimensions
  },
  {
    source: 'public/projects_logos/halcyon.png',
    destination: 'public/images/projects',
    filename: 'halcyon',
    maxWidth: 60 // Based on your displayed dimensions
  },
  {
    source: 'public/projects_logos/onthefly.png',
    destination: 'public/images/projects',
    filename: 'onthefly',
    maxWidth: 60 // Based on your displayed dimensions
  },
  {
    source: 'public/projects_logos/kira.png',
    destination: 'public/images/projects',
    filename: 'kira',
    maxWidth: 60 // Based on your displayed dimensions
  }
];

async function optimizeImages() {
  for (const image of imagesToOptimize) {
    const { source, destination, filename, maxWidth } = image;
    
    console.log(`Optimizing ${source}...`);
    
    try {
      // Make sure destination directory exists
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }
      
      // Read the source image
      const imageBuffer = fs.readFileSync(source);
      
      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();
      
      // For each size, create WebP and PNG versions
      for (const [sizeName, sizeWidth] of Object.entries(sizes)) {
        // Skip sizes larger than the original to avoid upscaling
        if (sizeWidth > metadata.width) continue;
        
        // Skip sizes much larger than what we need for display
        if (sizeWidth > maxWidth * 2) continue;
        
        // Create WebP version (better compression)
        await sharp(imageBuffer)
          .resize(sizeWidth)
          .webp({ quality: 80 })
          .toFile(path.join(destination, `${filename}-${sizeName}.webp`));
        
        // Create PNG fallback
        await sharp(imageBuffer)
          .resize(sizeWidth)
          .png({ compressionLevel: 9 })
          .toFile(path.join(destination, `${filename}-${sizeName}.png`));
      }
      
      console.log(`✅ Optimized ${source} to ${destination}/${filename}-*.webp`);
    } catch (error) {
      console.error(`❌ Error optimizing ${source}:`, error);
    }
  }
}

optimizeImages()
  .then(() => console.log('Image optimization complete!'))
  .catch(err => console.error('Error optimizing images:', err));
