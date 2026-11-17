// Gate: fails the build on any problem. Never weaken a check to get a release out.
// From scripts/validate.mjs in the site repositories made by sites@AgentiCCells.dinis
// (2026-11-16); factory@ added the hub.json fields, the description check and the
// placeholder check (a seeded site must hold no __SITE_*__ placeholder).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
// Width and height from a JPEG's start-of-frame marker; null if the bytes are not a JPEG.
function jpegSize(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}
const problems = [];
const fail = m => problems.push(m);
const hype = /\b(revolutionary|cutting[- ]edge|seamless(?:ly)?|world[- ]class|game[- ]changing)\b/i;
const isTemplate = existsSync('.factory-template');
if (!existsSync('_site')) { console.error('FAILED: _site/ is not built: run node scripts/build.mjs'); process.exit(1); }
const files = walk('_site');
for (const f of [...files, 'hub.json', 'README.md']) {
  if (!existsSync(f) || !/\.(html|js|css|json|md)$/.test(f)) continue;
  const s = readFileSync(f, 'utf8');
  s.split('\n').forEach((line, i) => {
    if (line.includes('—')) fail(`${f}:${i + 1}: em dash`);
    const m = line.match(hype); if (m) fail(`${f}:${i + 1}: hype word "${m[0]}"`);
    if (!isTemplate && /__SITE_[A-Z]+__/.test(line)) fail(`${f}:${i + 1}: template placeholder left in a seeded site`);
  });
  if (f.endsWith('.html')) {
    if (!/<title>[^<]+<\/title>/.test(s)) fail(`${f}: no <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(s)) fail(`${f}: no description`);
    if (!/<html lang="/.test(s)) fail(`${f}: no lang on <html>`);
    // Link previews (cells@ roll-out at Dinis's word, 2026-11-17; reference: Gabriel DaCruz's site 16fb163).
    // Every page: canonical and og:url absolute https; og:type, site_name, locale, title, description
    // (110 to 150 characters), image (absolute https, served here) with type, width, height and alt;
    // twitter:card summary_large_image. The card itself: a JPEG, 1200x630, at most 300 KB.
    {
      const meta = (n) => (s.match(new RegExp(`<meta (?:property|name)="${n}" content="([^"]*)"`)) || [])[1];
      const canonical = (s.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
      if (!canonical) fail(`${f}: no canonical link (link previews)`);
      else if (!/^https:\/\//.test(canonical)) fail(`${f}: canonical must be an absolute https URL`);
      for (const n of ['og:type', 'og:site_name', 'og:locale', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:type', 'og:image:width', 'og:image:height', 'og:image:alt', 'twitter:card']) if (!meta(n)) fail(`${f}: no ${n} (link previews)`);
      for (const n of ['og:url', 'og:image']) if (meta(n) && !/^https:\/\//.test(meta(n))) fail(`${f}: ${n} must be an absolute https URL`);
      const desc = (meta('og:description') || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      if (desc && (desc.length < 110 || desc.length > 150)) fail(`${f}: og:description is ${desc.length} characters; keep it between 110 and 150`);
      if (meta('twitter:card') && meta('twitter:card') !== 'summary_large_image') fail(`${f}: twitter:card must be summary_large_image`);
      const img = meta('og:image');
      if (img && /^https:\/\//.test(img)) {
        const local = join('_site', decodeURIComponent(new URL(img).pathname));
        if (new URL(img).host !== 'specialist-abp.agenticcells.site') fail(`${f}: og:image must be served by this site`);
        else if (!existsSync(local)) fail(`${f}: og:image ${img} is not in the site`);
        else {
          const buf = readFileSync(local);
          if (buf.length > 300 * 1024) fail(`${f}: the share card is ${Math.round(buf.length / 1024)} KB; keep it at most 300 KB`);
          const size = jpegSize(buf);
          if (!size) fail(`${f}: the share card is not a JPEG`);
          else if (size.w !== 1200 || size.h !== 630) fail(`${f}: the share card is ${size.w}x${size.h}; it must be 1200x630`);
          if (meta('og:image:width') !== '1200' || meta('og:image:height') !== '630') fail(`${f}: og:image:width and og:image:height must say 1200 and 630`);
        }
      }
    }
    for (const m of s.matchAll(/<script[^>]+src="([^"]+)"/g)) if (/^(https?:)?\/\//.test(m[1])) fail(`${f}: third-party script ${m[1]}`);
    for (const m of s.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) if (/^(https?:)?\/\//.test(m[1])) fail(`${f}: third-party stylesheet ${m[1]}`);
    for (const m of s.matchAll(/(?:href|src)="([^"#?]+)/g)) {
      const u = m[1]; if (/^(https?:|mailto:|data:|\/\/)/.test(u)) continue;
      const target = u.startsWith('/') ? join('_site', u) : join(dirname(f), u);
      if (!existsSync(target) && !existsSync(join(target, 'index.html'))) fail(`${f}: broken link ${u}`);
    }
  }
}
if (!existsSync('_site/version.json')) fail('no version.json');
if (!existsSync('_site/index.html')) fail('no index.html');
try {
  const h = JSON.parse(readFileSync('hub.json', 'utf8'));
  for (const k of ['name', 'what_it_does', 'owner', 'repository', 'live_address', 'version_from']) if (typeof h[k] !== 'string' || !h[k].trim()) fail(`hub.json: ${k} must be a non-empty string`);
  if (h.owner !== 'AgentiCCells') fail('hub.json: owner must be AgentiCCells');
  if (!h.licence || h.licence.code !== 'Apache-2.0' || h.licence.text !== 'CC BY 4.0') fail('hub.json: licence must be code Apache-2.0, text CC BY 4.0');
} catch (e) { fail(`hub.json is missing or not JSON (${e.message})`); }
if (problems.length) { console.error(problems.join('\n')); console.error(`FAILED: ${problems.length} problem(s)`); process.exit(1); }
console.log(`OK${isTemplate ? ' (template)' : ''}`);
