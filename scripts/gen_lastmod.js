// Build-time script: per-page lastmod for sitemap.xml.
// Stores a content hash per path in data/lastmod.json; the date only changes when the page's content changes.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'content.json');
const OUT = path.join(ROOT, 'data', 'lastmod.json');
const content = JSON.parse(fs.readFileSync(SRC, 'utf8'));
let prev = {};
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) {}
const today = new Date().toISOString().slice(0, 10);
const next = {};
for (const [p, x] of Object.entries(content)) {
  const h = crypto.createHash('sha1')
    .update(JSON.stringify([x.seo_title, x.meta_description, x.h1, x.body_html, x.faqs]))
    .digest('hex').slice(0, 12);
  next[p] = prev[p] && prev[p].h === h ? prev[p] : { h, d: today };
}
fs.writeFileSync(OUT, JSON.stringify(next, null, 1));
console.log('lastmod: %d pages, %d updated today', Object.keys(next).length, Object.keys(next).filter(k => next[k].d === today && !(prev[k] && prev[k].d === today)).length);
