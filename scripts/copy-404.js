import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assuming the script is in /scripts and dist is in root
const distDir = path.resolve(__dirname, '../dist');
const srcFile = path.join(distDir, 'index.html');
const destFile = path.join(distDir, '404.html');

try {
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log('✅ Successfully copied index.html to 404.html');
  } else {
    console.error('❌ Error: dist/index.html does not exist. Build might have failed.');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Error copying file:', err);
  process.exit(1);
}
