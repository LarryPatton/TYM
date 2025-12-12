import * as fs from 'fs';
import { join } from 'path';

const baseDir = 'public/images/themes';
const dirs = [
  "architecture",
  "traditional_painting",
  "digital_art",
  "illustration",
  "graphic_design",
  "photography",
  "animation",
  "industrial_design",
  "landscape_urban",
  "material",
  "sci_fi",
  "fantasy",
  "culture",
  "fashion",
  "nature",
  "abstract",
  "cinematic",
  "game_art",
  "mood",
  "artist_style"
];

dirs.forEach(dir => {
  const fullPath = join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
});
