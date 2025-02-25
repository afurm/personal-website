const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Generating favicons...');

// Install required packages if not already installed
try {
    execSync('npm list -g sharp || npm install -g sharp');
    execSync('npm list -g svgexport || npm install -g svgexport');
} catch (error) {
    console.error('Error installing dependencies:', error);
    process.exit(1);
}

// Paths
const publicDir = path.join(__dirname, '../public');
const faviconSvgPath = path.join(publicDir, 'favicon.svg');
const faviconLargeSvgPath = path.join(publicDir, 'favicon-large.svg');
const appleTouchIconSvgPath = path.join(publicDir, 'apple-touch-icon.svg');

// Generate favicon.ico (multiple sizes in one file)
try {
    // Convert SVG to PNG at different sizes
    execSync(`svgexport ${faviconLargeSvgPath} ${publicDir}/favicon-16.png 16:16`);
    execSync(`svgexport ${faviconLargeSvgPath} ${publicDir}/favicon-32.png 32:32`);
    execSync(`svgexport ${faviconLargeSvgPath} ${publicDir}/favicon-48.png 48:48`);

    // Combine PNGs into ICO file
    // Note: This requires ImageMagick to be installed
    execSync(`convert ${publicDir}/favicon-16.png ${publicDir}/favicon-32.png ${publicDir}/favicon-48.png ${publicDir}/favicon.ico`);

    // Clean up temporary files
    fs.unlinkSync(`${publicDir}/favicon-16.png`);
    fs.unlinkSync(`${publicDir}/favicon-32.png`);
    fs.unlinkSync(`${publicDir}/favicon-48.png`);

    console.log('favicon.ico generated successfully');
} catch (error) {
    console.error('Error generating favicon.ico:', error);
    console.log('Please install ImageMagick and try again, or manually convert the SVG to ICO using an online converter.');
}

// Generate apple-touch-icon.png
try {
    execSync(`svgexport ${appleTouchIconSvgPath} ${publicDir}/apple-touch-icon.png 180:180`);
    console.log('apple-touch-icon.png generated successfully');
} catch (error) {
    console.error('Error generating apple-touch-icon.png:', error);
}

console.log('Favicon generation complete!');

/**
 * Favicon Generation Guide
 * 
 * This script provides instructions for generating all required favicon files
 * from the SVG templates in the public directory.
 * 
 * SVG Templates:
 * - /public/favicon.svg - 32x32 SVG with the letter "F" (light mode)
 * - /public/favicon-dark.svg - 32x32 SVG with the letter "F" (dark mode)
 * - /public/favicon-large.svg - 512x512 SVG for generating various sizes
 * - /public/apple-touch-icon.svg - 180x180 SVG for Apple devices
 * 
 * Files to generate:
 * 1. favicon.ico - Multi-size ICO file (16x16, 32x32, 48x48)
 * 2. favicon-16x16.png - 16x16 PNG
 * 3. favicon-32x32.png - 32x32 PNG
 * 4. apple-touch-icon.png - 180x180 PNG
 * 5. android-chrome-192x192.png - 192x192 PNG
 * 6. android-chrome-512x512.png - 512x512 PNG
 * 
 * How to generate:
 * 
 * Option 1: Use an online favicon generator
 * - Visit https://realfavicongenerator.net/ or https://favicon.io/
 * - Upload the SVG files and download the generated package
 * - Replace the placeholder files in the public directory
 * 
 * Option 2: Use command-line tools
 * - Install Inkscape (https://inkscape.org/) for SVG to PNG conversion
 * - Install ImageMagick (https://imagemagick.org/) for PNG to ICO conversion
 * 
 * Example commands:
 * 
 * # Convert SVG to PNG (using Inkscape)
 * inkscape -w 16 -h 16 public/favicon.svg -o public/favicon-16x16.png
 * inkscape -w 32 -h 32 public/favicon.svg -o public/favicon-32x32.png
 * inkscape -w 180 -h 180 public/apple-touch-icon.svg -o public/apple-touch-icon.png
 * inkscape -w 192 -h 192 public/favicon-large.svg -o public/android-chrome-192x192.png
 * inkscape -w 512 -h 512 public/favicon-large.svg -o public/android-chrome-512x512.png
 * 
 * # Convert PNGs to ICO (using ImageMagick)
 * convert public/favicon-16x16.png public/favicon-32x32.png public/favicon.ico
 * 
 * Note: The site.webmanifest file is already configured to reference these icons.
 */

console.log("This is a guide script. Please read the instructions above to generate favicon files.");
console.log("No automatic generation is performed by this script."); 