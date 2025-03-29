#!/bin/bash

# CAAKE Website Image Optimization Script
# This script optimizes all JPG, PNG, and GIF images in the assets/images directory
# and creates WebP versions for modern browsers

# Required tools:
# - ImageMagick (convert, mogrify)
# - jpegoptim
# - optipng
# - gifsicle
# - cwebp

echo "🚀 Starting CAAKE image optimization..."

# Check if required tools are installed
command -v convert >/dev/null 2>&1 || { echo "❌ ImageMagick (convert) is required but not installed. Aborting."; exit 1; }
command -v jpegoptim >/dev/null 2>&1 || { echo "❌ jpegoptim is required but not installed. Aborting."; exit 1; }
command -v optipng >/dev/null 2>&1 || { echo "❌ optipng is required but not installed. Aborting."; exit 1; }
command -v gifsicle >/dev/null 2>&1 || { echo "❌ gifsicle is required but not installed. Aborting."; exit 1; }
command -v cwebp >/dev/null 2>&1 || { echo "❌ cwebp is required but not installed. Aborting."; exit 1; }

# Create backup directory
BACKUP_DIR="./image-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📁 Created backup directory: $BACKUP_DIR"

# Function to optimize JPEG images
optimize_jpeg() {
    echo "🖼️ Optimizing JPEG images..."
    find ./assets/images -type f -name "*.jpg" -o -name "*.jpeg" | while read img; do
        # Create backup
        cp "$img" "$BACKUP_DIR/$(basename "$img")"
        
        # Resize if larger than 1920px width
        width=$(identify -format "%w" "$img")
        if [ "$width" -gt 1920 ]; then
            echo "  ↓ Resizing $(basename "$img") from ${width}px to 1920px width"
            mogrify -resize 1920x "$img"
        fi
        
        # Optimize
        echo "  ✓ Optimizing $(basename "$img")"
        jpegoptim --strip-all --max=85 "$img"
        
        # Create WebP version
        webp_file="${img%.*}.webp"
        echo "  + Creating WebP version: $(basename "$webp_file")"
        cwebp -q 85 "$img" -o "$webp_file"
    done
}

# Function to optimize PNG images
optimize_png() {
    echo "🖼️ Optimizing PNG images..."
    find ./assets/images -type f -name "*.png" | while read img; do
        # Create backup
        cp "$img" "$BACKUP_DIR/$(basename "$img")"
        
        # Resize if larger than 1920px width
        width=$(identify -format "%w" "$img")
        if [ "$width" -gt 1920 ]; then
            echo "  ↓ Resizing $(basename "$img") from ${width}px to 1920px width"
            mogrify -resize 1920x "$img"
        fi
        
        # Optimize
        echo "  ✓ Optimizing $(basename "$img")"
        optipng -o5 "$img"
        
        # Create WebP version
        webp_file="${img%.*}.webp"
        echo "  + Creating WebP version: $(basename "$webp_file")"
        cwebp -q 85 "$img" -o "$webp_file"
    done
}

# Function to optimize GIF images
optimize_gif() {
    echo "🖼️ Optimizing GIF images..."
    find ./assets/images -type f -name "*.gif" | while read img; do
        # Create backup
        cp "$img" "$BACKUP_DIR/$(basename "$img")"
        
        # Optimize
        echo "  ✓ Optimizing $(basename "$img")"
        gifsicle -O3 "$img" -o "$img.tmp"
        mv "$img.tmp" "$img"
        
        # Create WebP version
        webp_file="${img%.*}.webp"
        echo "  + Creating WebP version: $(basename "$webp_file")"
        
        # Check if GIF is animated
        frames=$(identify "$img" | wc -l)
        if [ "$frames" -gt 1 ]; then
            # Animated GIF
            gif2webp -q 85 "$img" -o "$webp_file"
        else
            # Static GIF
            cwebp -q 85 "$img" -o "$webp_file"
        fi
    done
}

# Create directory for responsive images
mkdir -p "./assets/images/responsive"
echo "📁 Created directory for responsive images"

# Function to create responsive image versions
create_responsive_images() {
    echo "🖼️ Creating responsive image versions..."
    find ./assets/images -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read img; do
        base_name=$(basename "$img")
        filename="${base_name%.*}"
        ext="${base_name##*.}"
        
        # Skip if already processed
        if [[ "$filename" == *"-small"* ]] || [[ "$filename" == *"-medium"* ]] || [[ "$filename" == *"-large"* ]]; then
            continue
        fi
        
        echo "  ✓ Creating responsive versions for $base_name"
        
        # Create small version (400px width)
        convert "$img" -resize 400x "./assets/images/responsive/${filename}-small.${ext}"
        cwebp -q 85 "./assets/images/responsive/${filename}-small.${ext}" -o "./assets/images/responsive/${filename}-small.webp"
        
        # Create medium version (800px width)
        convert "$img" -resize 800x "./assets/images/responsive/${filename}-medium.${ext}"
        cwebp -q 85 "./assets/images/responsive/${filename}-medium.${ext}" -o "./assets/images/responsive/${filename}-medium.webp"
        
        # Create large version (1200px width)
        convert "$img" -resize 1200x "./assets/images/responsive/${filename}-large.${ext}"
        cwebp -q 85 "./assets/images/responsive/${filename}-large.${ext}" -o "./assets/images/responsive/${filename}-large.webp"
    done
}

# Run optimization functions
optimize_jpeg
optimize_png
optimize_gif
create_responsive_images

echo "✅ Image optimization complete!"
echo "📊 Backup saved to: $BACKUP_DIR"
echo "🔄 Remember to update your HTML to use the new WebP images with fallbacks."
echo "Example:"
echo "<picture>"
echo "  <source srcset=\"image.webp\" type=\"image/webp\">"
echo "  <img src=\"image.jpg\" alt=\"Description\" width=\"800\" height=\"600\" loading=\"lazy\">"
echo "</picture>"
echo ""
echo "For responsive images:"
echo "<picture>"
echo "  <source media=\"(max-width: 600px)\" srcset=\"responsive/image-small.webp\" type=\"image/webp\">"
echo "  <source media=\"(max-width: 600px)\" srcset=\"responsive/image-small.jpg\">"
echo "  <source media=\"(max-width: 1200px)\" srcset=\"responsive/image-medium.webp\" type=\"image/webp\">"
echo "  <source media=\"(max-width: 1200px)\" srcset=\"responsive/image-medium.jpg\">"
echo "  <source srcset=\"responsive/image-large.webp\" type=\"image/webp\">"
echo "  <img src=\"responsive/image-large.jpg\" alt=\"Description\" loading=\"lazy\">"
echo "</picture>" 