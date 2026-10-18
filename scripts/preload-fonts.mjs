// Adds <link rel="preload"> for the critical latin fonts to every built HTML page.
// Font file names are content-hashed by webpack, so this runs after `docusaurus build`.
// It avoids the late font swap that shifts headings (CLS) on slow connections.
import fs from 'node:fs';
import path from 'node:path';

const BUILD = path.resolve(import.meta.dirname, '..', 'build');
const FONT_DIR = path.join(BUILD, 'assets', 'fonts');
const WANTED = [/^inter-latin-wght-normal-.*\.woff2$/, /^poppins-latin-(500|600|700)-normal-.*\.woff2?$/];

const fonts = fs.readdirSync(FONT_DIR).filter(f => WANTED.some(re => re.test(f)));
if (!fonts.length) throw new Error('preload-fonts: no matching font files found in build/assets/fonts');
const tags = fonts
  .map(f => `<link rel="preload" href="/assets/fonts/${f}" as="font" type="font/${f.endsWith('.woff2') ? 'woff2' : 'woff'}" crossorigin>`)
  .join('');

let count = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) {
      const html = fs.readFileSync(p, 'utf8');
      if (html.includes('</head>') && !html.includes('rel="preload" href="/assets/fonts/')) {
        fs.writeFileSync(p, html.replace('</head>', `${tags}</head>`));
        count++;
      }
    }
  }
})(BUILD);
console.log(`preload-fonts: ${fonts.length} fonts preloaded in ${count} pages`);
