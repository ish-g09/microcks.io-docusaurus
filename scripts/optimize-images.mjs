// Re-encodes oversized raster images in place (same filenames, so URLs never change) and minifies heavy SVGs.
// Usage: npm run optimize-images [-- --dry]
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'static/images');
const MAX_WIDTH = 1800;
const MIN_BYTES = 150 * 1024;
const dry = process.argv.includes('--dry');

function walk(dir, fn) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, fn) : fn(p);
  }
}

const files = [];
walk(DIR, p => files.push(p));
let before = 0, after = 0, changed = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const size = fs.statSync(file).size;
  if (size < MIN_BYTES) continue;
  let out;
  if (ext === '.svg') {
    if (dry) continue;
    // Logos embedded as base64 PNGs dominate the weight of some SVGs: downscale and re-palette them.
    let svg = fs.readFileSync(file, 'utf8');
    const embedded = [...svg.matchAll(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g)];
    for (const [uri, b64] of embedded) {
      const small = await sharp(Buffer.from(b64, 'base64')).resize({width: 192, withoutEnlargement: true}).png({palette: true, quality: 90, effort: 8}).toBuffer();
      svg = svg.replace(uri, `data:image/png;base64,${small.toString('base64')}`);
    }
    if (embedded.length) fs.writeFileSync(file, svg);
    const tmp = `${file}.min`;
    execFileSync(path.join(ROOT, 'node_modules/.bin/svgo'), ['-i', file, '-o', tmp, '--multipass'], {stdio: 'ignore'});
    out = fs.readFileSync(tmp);
    fs.rmSync(tmp);
  } else if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    const img = sharp(file, {animated: false}).rotate();
    const meta = await img.metadata();
    const maxW = file.includes('/images/blog/') ? 1200 : MAX_WIDTH;
    const pipeline = meta.width > maxW ? img.resize({width: maxW}) : img;
    out = await (ext === '.png'
      ? pipeline.png({compressionLevel: 9, palette: true, quality: 90, effort: 8})
      : pipeline.jpeg({quality: 82, mozjpeg: true})).toBuffer();
  } else continue;
  before += size;
  if (out.length < size * 0.95) {
    after += out.length;
    changed++;
    if (!dry) fs.writeFileSync(file, out);
  } else after += size;
}
console.log(`${changed} files optimised: ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB${dry ? ' (dry run)' : ''}`);
