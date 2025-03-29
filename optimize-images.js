const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'assets', 'images');
const webpDir = path.join(__dirname, 'assets', 'webp');

// Create webp directory if it doesn't exist
if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir, { recursive: true });
}

// Function to convert images to WebP
async function convertToWebP(files) {
    console.log('Converting images to WebP format...');
    
    // Process each image
    for (const file of files) {
        const filePath = path.join(imageDir, file);
        const fileExt = path.extname(file).toLowerCase();
        const fileName = path.basename(file, fileExt);
        
        // Only process JPG, PNG, and JPEG files
        if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
            const webpPath = path.join(webpDir, `${fileName}.webp`);
            console.log(`Converting ${file} to WebP...`);
            
            try {
                // Generate WebP version
                await sharp(filePath)
                    .webp({ quality: 80 })
                    .toFile(webpPath);
                
                console.log(`Successfully converted ${file} to WebP`);
                
                // Generate optimized original format as well
                const optimizedPath = path.join(webpDir, file);
                
                if (fileExt === '.png') {
                    await sharp(filePath)
                        .png({ quality: 80, compressionLevel: 9 })
                        .toFile(optimizedPath);
                } else {
                    await sharp(filePath)
                        .jpeg({ quality: 80, progressive: true })
                        .toFile(optimizedPath);
                }
                
                console.log(`Successfully optimized original ${file}`);
            } catch (error) {
                console.error(`Error converting ${file} to WebP:`, error);
            }
        }
    }
}

// Function to optimize images (resize, compress)
async function optimizeImages(files) {
    console.log('Optimizing images...');
    
    // Process each image
    for (const file of files) {
        const filePath = path.join(imageDir, file);
        const fileExt = path.extname(file).toLowerCase();
        
        // Only process JPG, PNG, and JPEG files
        if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
            const optimizedPath = path.join(imageDir, 'optimized-' + file);
            console.log(`Optimizing ${file}...`);
            
            try {
                // Determine image dimensions
                const metadata = await sharp(filePath).metadata();
                
                // Resize large images
                let sharpInstance = sharp(filePath);
                
                // If image is wider than 1600px, resize it proportionally
                if (metadata.width > 1600) {
                    sharpInstance = sharpInstance.resize({
                        width: 1600,
                        fit: 'inside',
                        withoutEnlargement: true
                    });
                }
                
                // Compress and save optimized image
                if (fileExt === '.png') {
                    await sharpInstance
                        .png({ quality: 80, compressionLevel: 9 })
                        .toFile(optimizedPath);
                } else {
                    await sharpInstance
                        .jpeg({ quality: 80, progressive: true })
                        .toFile(optimizedPath);
                }
                
                console.log(`Successfully optimized ${file}`);
            } catch (error) {
                console.error(`Error optimizing ${file}:`, error);
            }
        }
    }
}

// Main function
async function main() {
    console.log('Scanning for images...');
    
    try {
        // Read all files in the images directory
        const files = fs.readdirSync(imageDir);
        console.log(`Found ${files.length} files in the images directory`);
        
        // Filter out directories and non-image files
        const imageFiles = files.filter(file => {
            const filePath = path.join(imageDir, file);
            const fileExt = path.extname(file).toLowerCase();
            return fs.statSync(filePath).isFile() && 
                   ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(fileExt);
        });
        
        console.log(`Found ${imageFiles.length} image files to process`);
        
        // Optimize the original images
        await optimizeImages(imageFiles);
        
        // Convert images to WebP format
        await convertToWebP(imageFiles);
        
        console.log('Image optimization and WebP conversion completed successfully!');
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

// Run the main function
main(); 