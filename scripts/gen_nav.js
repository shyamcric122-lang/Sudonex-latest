// Build-time script: reads data/content.json and writes data/nav.json
// nav.json = slim per-page nav data for CLIENT components (no body_html/schemas/faqs/toc/outbound_links).
// Regenerated before every build via the "prebuild" npm script (content.json changes daily).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'content.json');
const OUT = path.join(ROOT, 'data', 'nav.json');

function stripTags(s) {
  return String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const content = JSON.parse(fs.readFileSync(SRC, 'utf8'));

const nav = Object.values(content).map(p => ({
  path: p.path,
  title: stripTags(p.h1) || p.seo_title || p.path,
  layer: p.layer,
  cluster: p.cluster,
  primary_kw: p.primary_kw,
  funnel: p.funnel,
  meta_description: p.meta_description,
}));

fs.writeFileSync(OUT, JSON.stringify(nav, null, 0));
console.log(`gen_nav: wrote ${nav.length} slim nav entries to data/nav.json`);
