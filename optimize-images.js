const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'assets', 'images');

// Generate placeholder images
async function generatePlaceholderImages() {
    const placeholders = {
        'story1.jpg': { width: 800, height: 600, text: 'Retail Transformation' },
        'story2.jpg': { width: 800, height: 600, text: 'Healthcare Innovation' },
        'story3.jpg': { width: 800, height: 600, text: 'Financial Services' },
        'team.jpg': { width: 600, height: 400, text: 'CAAKE Team' }
    };

    for (const [filename, config] of Object.entries(placeholders)) {
        const outputPath = path.join(imageDir, filename);
        
        // Create a gradient background
        const gradient = sharp({
            create: {
                width: config.width,
                height: config.height,
                channels: 4,
                background: { r: 240, g: 240, b: 240, alpha: 1 }
            }
        });

        // Add text
        const svg = `
            <svg width="${config.width}" height="${config.height}">
                <style>
                    .title { fill: #333; font-size: 24px; font-weight: bold; font-family: Arial; }
                </style>
                <text x="50%" y="50%" text-anchor="middle" class="title">${config.text}</text>
            </svg>`;

        await gradient
            .composite([{
                input: Buffer.from(svg),
                top: 0,
                left: 0,
            }])
            .jpeg({ quality: 80 })
            .toFile(outputPath);
        
        console.log(`Generated placeholder ${filename}`);
    }
}

// Generate social media images
async function generateSocialImages() {
    const sourceImage = path.join(imageDir, 'logo.png');
    const sizes = {
        'og-image.jpg': { width: 1200, height: 630 },
        'twitter-image.jpg': { width: 1200, height: 600 }
    };
    
    if (fs.existsSync(sourceImage)) {
        for (const [filename, dimensions] of Object.entries(sizes)) {
            const outputPath = path.join(imageDir, filename);
            
            await sharp(sourceImage)
                .resize(dimensions.width, dimensions.height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
                .jpeg({ quality: 80 })
                .toFile(outputPath);
            console.log(`Generated ${filename}`);
        }
    } else {
        console.log('Skipping social media images - logo.png not found');
    }
}

// Main function to run all optimizations
async function optimizeAllImages() {
    try {
        await generatePlaceholderImages();
        await generateSocialImages();
        console.log('All images optimized successfully!');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeAllImages(); 