const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Generating favicons...');

// Paths
const publicDir = path.join(__dirname, '../public');
const faviconSvgPath = path.join(publicDir, 'favicon.svg');
const faviconDarkSvgPath = path.join(publicDir, 'favicon-dark.svg');
const faviconLargeSvgPath = path.join(publicDir, 'favicon-large.svg');

// Generate PNG favicons
try {
  // Generate favicon PNGs
  execSync(`svgexport ${faviconSvgPath} ${publicDir}/favicon-16x16.png 16:16`);
  execSync(`svgexport ${faviconSvgPath} ${publicDir}/favicon-32x32.png 32:32`);

  // Generate Android Chrome icons
  execSync(`svgexport ${faviconLargeSvgPath} ${publicDir}/android-chrome-192x192.png 192:192`);
  execSync(`svgexport ${faviconLargeSvgPath} ${publicDir}/android-chrome-512x512.png 512:512`);

  // Generate Apple Touch Icon
  execSync(`svgexport ${faviconLargeSvgPath} ${publicDir}/apple-touch-icon.png 180:180`);

  console.log('PNG favicons generated successfully');
} catch (error) {
  console.error('Error generating PNG favicons:', error);
}

// Generate favicon.ico using ImageMagick if available
try {
  // Check if ImageMagick is installed
  execSync('which convert');

  // Generate temporary PNGs for ICO conversion
  execSync(`svgexport ${faviconSvgPath} ${publicDir}/temp-16.png 16:16`);
  execSync(`svgexport ${faviconSvgPath} ${publicDir}/temp-32.png 32:32`);
  execSync(`svgexport ${faviconSvgPath} ${publicDir}/temp-48.png 48:48`);

  // Combine PNGs into ICO file
  execSync(
    `convert ${publicDir}/temp-16.png ${publicDir}/temp-32.png ${publicDir}/temp-48.png ${publicDir}/favicon.ico`
  );

  // Clean up temporary files
  fs.unlinkSync(`${publicDir}/temp-16.png`);
  fs.unlinkSync(`${publicDir}/temp-32.png`);
  fs.unlinkSync(`${publicDir}/temp-48.png`);

  console.log('favicon.ico generated successfully using ImageMagick');
} catch (error) {
  console.log(
    'ImageMagick not available or error occurred. Generating favicon.ico using alternative method...'
  );

  try {
    // Alternative: Use png2ico if available
    execSync('npm install -g png2ico');
    execSync(`svgexport ${faviconSvgPath} ${publicDir}/temp-16.png 16:16`);
    execSync(`svgexport ${faviconSvgPath} ${publicDir}/temp-32.png 32:32`);
    execSync(`png2ico ${publicDir}/favicon.ico ${publicDir}/temp-16.png ${publicDir}/temp-32.png`);

    // Clean up temporary files
    fs.unlinkSync(`${publicDir}/temp-16.png`);
    fs.unlinkSync(`${publicDir}/temp-32.png`);

    console.log('favicon.ico generated successfully using png2ico');
  } catch (secondError) {
    console.error('Error generating favicon.ico:', secondError);
    console.log(
      'Please manually convert the SVG to ICO using an online converter like https://convertio.co/svg-ico/'
    );
  }
}

console.log('Favicon generation complete!');
console.log('Remember to check that all files were generated correctly before deploying.');

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

console.log(
  'This is a guide script. Please read the instructions above to generate favicon files.'
);
console.log('No automatic generation is performed by this script.');
