// Runs before the build (also on Netlify): gives every doc/blog page a short `description` frontmatter
// derived from its first paragraph when none is authored, so llms.txt and <meta description> stay clean.
// Authored descriptions are never touched. Idempotent.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import * as yaml from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const MAX = 160;
const engines = {yaml: {parse: yaml.load, stringify: o => yaml.dump(o, {lineWidth: -1})}};

function walk(dir, fn) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, fn) : /\.mdx?$/.test(e.name) && fn(p);
  }
}

function plain(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstParagraph(content) {
  const blocks = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^(import|export) .*$/gm, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\n\s*\n/);
  for (const b of blocks) {
    const t = b.trim();
    if (!t || /^(#|:::|<|\||[-*] |\d+\. |!\[)/.test(t)) continue;
    const text = plain(t);
    if (text.length > 20) return text;
  }
  return '';
}

function shorten(text) {
  const sentence = /^(.+?[.!?])(\s|$)/.exec(text)?.[1] ?? text;
  const candidate = sentence.length <= MAX ? sentence : text;
  if (candidate.length <= MAX) return candidate;
  const cut = candidate.slice(0, MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

let updated = 0;
for (const dir of ['docs', 'blog']) {
  walk(path.join(ROOT, dir), p => {
    const src = fs.readFileSync(p, 'utf8');
    const parsed = matter(src, {engines});
    if (typeof parsed.data.description === 'string' && parsed.data.description.trim()) return;
    const description = shorten(firstParagraph(parsed.content));
    if (!description) return;
    parsed.data.description = description;
    fs.writeFileSync(p, matter.stringify(parsed.content, parsed.data, {engines}));
    updated++;
  });
}
console.log(`ensure-descriptions: ${updated} page(s) updated`);
