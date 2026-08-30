const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
  { src: 'src/Images/LEEMSDTT master.png', maxWidth: 600, quality: 75 },
  { src: 'src/Images/valortrust construct logo 1.png', maxWidth: 400, quality: 80 },
  { src: 'src/Images/Leemsdtt logo.png', maxWidth: 300, quality: 80 },
  { src: 'src/Images/Valortrust logo.png', maxWidth: 300, quality: 80 },
  { src: 'src/Images/Procurement logo.png', maxWidth: 300, quality: 80 },
  { src: 'src/Images/About.png', maxWidth: 800, quality: 80 },
  { src: 'src/Images/Digital strategy.jpg', maxWidth: 600, quality: 80 },
  { src: 'Hero.png', maxWidth: 600, quality: 80 },
];

async function convert() {
  for (const img of images) {
    const ext = path.extname(img.src);
    const dest = img.src.replace(ext, '.webp');
    try {
      await sharp(img.src)
        .resize({ width: img.maxWidth, withoutEnlargement: true })
        .webp({ quality: img.quality })
        .toFile(dest);
      const origSize = fs.statSync(img.src).size;
      const newSize = fs.statSync(dest).size;
      console.log(`${path.basename(img.src)}: ${(origSize/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB (${((1 - newSize/origSize) * 100).toFixed(0)}% smaller)`);
    } catch (err) {
      console.error(`Error converting ${img.src}:`, err.message);
    }
  }
  console.log('\nDone! All images converted to WebP.');
}

convert();
