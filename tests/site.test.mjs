import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {markdownPathname} from '../netlify/edge-functions/content-negotiation.js';

const ROOT = path.resolve(import.meta.dirname, '..');

test('markdown negotiation maps routes to .md twins', () => {
  assert.equal(markdownPathname('/'), '/index.md');
  assert.equal(markdownPathname('/documentation/'), '/documentation.md');
  assert.equal(markdownPathname('/blog/some-post/'), '/blog/some-post.md');
  assert.equal(markdownPathname('/images/a.png'), null);
  assert.equal(markdownPathname('/helm/index.yaml'), '/helm/index.yaml.md');
});

test('legacy redirects are declared', () => {
  const r = fs.readFileSync(path.join(ROOT, 'static/_redirects'), 'utf8');
  for (const rule of ['/docs/*', '/discord-invite', '/author/:slug', '/tags/*']) assert.ok(r.includes(rule), rule);
});

test('stable distribution paths are shipped as static files', () => {
  for (const p of ['static/helm', 'static/operator', 'static/compose', 'static/schemas', 'static/go-client/index.html']) {
    assert.ok(fs.existsSync(path.join(ROOT, p)), p);
  }
});

test('Discord invite is only defined in static/_redirects', () => {
  const offenders = [];
  const walk = d => fs.readdirSync(d, {withFileTypes: true}).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return walk(p);
    if (/\.(mdx?|js|mjs)$/.test(p) && /discord\.(gg|com\/invite)/.test(fs.readFileSync(p, 'utf8'))) offenders.push(path.relative(ROOT, p));
  });
  ['src', 'docs', 'blog'].forEach(d => walk(path.join(ROOT, d)));
  assert.deepEqual(offenders, [], 'link to https://microcks.io/discord-invite instead');
});
