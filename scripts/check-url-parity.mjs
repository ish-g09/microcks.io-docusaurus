// Verifies every URL of the live Hugo sitemap still resolves in the local build (or is covered by a redirect).
// Usage: npm run check:parity
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const BUILD = path.join(ROOT, 'build');
const SITEMAP = process.env.LIVE_SITEMAP || 'https://microcks.io/sitemap.xml';

const redirects = fs.readFileSync(path.join(ROOT, 'static/_redirects'), 'utf8')
  .split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => l.trim().split(/\s+/)[0]);
const matchesRedirect = p => redirects.some(r => (r.endsWith('*') ? p.startsWith(r.slice(0, -1)) : r.includes(':') ? new RegExp(`^${r.replace(/:\w+/g, '[^/]+')}$`).test(p) : r === p));

const xml = await (await fetch(SITEMAP)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
const missing = urls.filter(p => {
  const clean = p.replace(/\/$/, '');
  const candidates = [path.join(BUILD, clean, 'index.html'), path.join(BUILD, clean)];
  return !candidates.some(c => fs.existsSync(c) && fs.statSync(c).isFile()) && !matchesRedirect(p) && !matchesRedirect(`${clean}/`);
});
console.log(`${urls.length} live URLs checked, ${missing.length} missing`);
missing.forEach(u => console.log(`  ✗ ${u}`));
process.exit(missing.length ? 1 : 0);
