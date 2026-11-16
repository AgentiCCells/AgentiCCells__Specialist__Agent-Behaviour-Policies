// Render the specialist's Markdown (abp/, guidance/, examples/, mistakes/, pack/, reviews/,
// proposals/) into pages under _site/, each with its .md twin beside it, so the page and the
// file cannot drift. Node built-ins only. A small Markdown subset: headings, paragraphs,
// lists (two levels), fenced code, tables, block quotes, bold, italics, inline code, links.
// Written by specialist.abp@AgentiCCells.dinis, 2026-11-16. Code Apache-2.0.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

export const SOURCES = ['abp', 'guidance', 'examples', 'mistakes', 'pack', 'reviews', 'proposals'];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    // Links between Markdown files point at the rendered page; external links stay as they are.
    if (!/^(https?:|mailto:)/.test(u)) u = u.replace(/README\.md(#|$)/, 'index.md$1').replace(/\.md(#|$)/, '.html$1').replace(/\/$/, '/index.html');
    return `<a href="${u}">${t}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}

export function markdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  const para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para.length = 0; } };
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      flush();
      const lang = line.slice(3).trim();
      const body = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) body.push(lines[i++]);
      i++;
      out.push(`<pre${lang ? ` data-lang="${esc(lang)}"` : ''}><code>${esc(body.join('\n'))}</code></pre>`);
      continue;
    }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      flush();
      const n = m[1].length;
      const id = m[2].toLowerCase().replace(/`/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      out.push(`<h${n} id="${id}">${inline(m[2])}</h${n}>`);
      i++;
      continue;
    }
    if (/^\s*$/.test(line)) { flush(); i++; continue; }
    if (/^---+\s*$/.test(line)) { flush(); out.push('<hr>'); i++; continue; }
    if (/^>\s?/.test(line)) {
      flush();
      const body = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdown(body.join('\n'))}</blockquote>`);
      continue;
    }
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      flush();
      const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push(`<div class="table"><table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      flush();
      // Collect the list block (items and their indented continuation lines).
      const block = [];
      while (i < lines.length && (/^\s*([-*]|\d+\.)\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && block.length))) block.push(lines[i++]);
      out.push(list(block));
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flush();
  return out.join('\n');
}

function list(block) {
  const ordered = /^\s*\d+\./.test(block[0]);
  const items = [];
  for (const l of block) {
    const m = l.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (m && m[1].length < 2) items.push({ text: [m[3]], sub: [] });
    else if (m) items[items.length - 1].sub.push(l.replace(/^\s{2,4}/, ''));
    else if (items.length) {
      const last = items[items.length - 1];
      if (last.sub.length) last.sub.push(l.replace(/^\s{2,4}/, ''));
      else last.text.push(l.trim());
    }
  }
  const tag = ordered ? 'ol' : 'ul';
  return `<${tag}>${items.map((it) => `<li>${inline(it.text.join(' '))}${it.sub.length ? list(it.sub) : ''}</li>`).join('')}</${tag}>`;
}

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

export function page({ title, description, body, depth, version }) {
  const up = depth ? '../'.repeat(depth) : '';
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="stylesheet" href="${up}style.css">
</head>
<body>
<main>
<nav class="crumbs"><a href="${up}index.html">Agent Behaviour Policies specialist</a></nav>
${body}
<footer>
<p class="muted">Part of <a href="https://agenticcells.site">AgentiCCells</a>. Version ${esc(version)}. Code Apache-2.0, text CC BY 4.0.</p>
</footer>
</main>
</body>
</html>
`;
}

// Render every Markdown file in SOURCES into _site/<same path>.html, and copy the .md twin.
// A directory's README.md becomes its index.html.
export function renderAll(version) {
  const pages = [];
  for (const dir of SOURCES) {
    if (!existsSync(dir)) continue;
    for (const f of walk(dir)) {
      if (!f.endsWith('.md')) continue;
      const md = readFileSync(f, 'utf8');
      const target = join('_site', f.replace(/README\.md$/, 'index.md'));
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, md);
      const titleLine = (md.match(/^#\s+(.+)$/m) || [, f])[1].replace(/`/g, '');
      const firstPara = (md.split('\n\n').find((b) => b.trim() && !/^[#>|`-]/.test(b.trim())) || titleLine).replace(/\s+/g, ' ').replace(/[*`[\]]/g, '').slice(0, 220).trim();
      const depth = relative('_site', dirname(target)).split('/').filter(Boolean).length;
      const twin = target.split('/').pop();
      const body = `${markdown(md)}\n<p class="muted">This page is generated from <a href="${twin}">${esc(twin)}</a>, its Markdown twin.</p>`;
      writeFileSync(target.replace(/\.md$/, '.html'), page({ title: titleLine, description: firstPara, body, depth, version }));
      pages.push(target);
    }
  }
  return pages;
}
