// Parses _meta/content/{content,showcase,profile}.md -> content.json, and writes the crawlable static HTML
// (between the seo markers in index.html) plus sitemap.xml.   Run: node _meta/scripts/build_content.js   (from 2026/)
// content.md = the topics (challenge, what, diagram source). showcase.md = extras per topic + extra topics. profile.md = the rest of the page.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');
const read = f => fs.readFileSync(path.join(root, '_meta', 'content', f), 'utf8');

const norm = s => s.toLowerCase().replace(/&/g, 'and').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');
const slug = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

function parseContent(md) {
  const chapters = [], rows = []; let ch = null, tp = null, fence = false, mode = '';
  const startTopic = (title) => { tp = { slug: slug(title), title, challenge: '', what: [], applications: [], extras: [] }; ch.topics.push(tp); };
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('```')) { fence = !fence; continue; }
    if (fence || !line || line === '---' || line.startsWith('%%') || line.startsWith('# ')) { if (!line) mode = mode === 'apps' ? '' : mode; continue; }
    if (line.startsWith('## ')) { const title = line.slice(3); ch = { slug: slug(title), title, topics: [], direct: true }; chapters.push(ch); tp = null; mode = ''; continue; }
    if (line.startsWith('### ')) { ch.direct = false; startTopic(line.slice(4)); mode = ''; continue; }
    if (line.startsWith('|')) { const m = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|$/); if (m) rows.push({ title: m[1], text: m[2] }); continue; }
    if (!ch) continue;
    if (line.startsWith('Challenge:')) { if (!tp) startTopic(ch.title); tp.challenge = line.slice(10).trim(); continue; }
    if (line.startsWith('Visualisation:')) continue;
    if (line.startsWith('Application:')) { mode = 'apps'; continue; }
    if (mode === 'apps' && line.startsWith('- ')) { tp.applications.push(line.slice(2)); continue; }
    if (tp && !line.startsWith('- ') && ch.title !== 'Knowledge Sharing') tp.what.push(line);
    if (ch.title === 'Knowledge Sharing') ch.note = line;
  }
  chapters.forEach(c => c.topics.forEach(t => {
    const b = norm(t.title);
    const hit = rows.filter(r => { const n = norm(r.title); return n === b || n.startsWith(b) || b.startsWith(n); });
    if (hit.length) t.what = hit.map(r => r.text);
  }));
  return chapters.filter(c => c.topics.length);
}

function parseBullets(block) { return block.filter(l => l.startsWith('- ')).map(l => l.slice(2)); }
function parseShowcase(md, chapters) {
  const blocks = md.split(/^### /m).slice(1);
  blocks.forEach(b => {
    const [titleLine, ...rest] = b.split('\n'); const title = titleLine.trim();
    const kv = parseBullets(rest.map(l => l.trim())).map(l => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/`/g, '')]; });
    const sec = kv.find(([k]) => k === 'Section');
    if (sec) {
      const c = chapters.find(c => c.title === sec[1]); if (!c) return;
      const get = k => (kv.find(([x]) => x === k) || [, ''])[1];
      c.topics.push({ slug: slug(title), title, challenge: get('Challenge'), what: [get('What')], applications: [], extras: [] }); return;
    }
    const t = chapters.flatMap(c => c.topics).find(t => norm(t.title) === norm(title));
    if (t) t.extras = kv.map(([k, v]) => ({ k, v }));
  });
}

function parseProfile(md) {
  const secs = {}; md.split(/^## /m).slice(1).forEach(s => { const [h, ...r] = s.split('\n'); secs[h.trim()] = r; });
  const paras = lines => lines.join('\n').split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !p.startsWith('-') && !p.startsWith('#'));
  const kv = parseBullets(secs.Hero || []).map(l => l.split(/:\s*/));
  const about = (secs.About || []); const cut = about.findIndex(l => l.startsWith('### '));
  const bi = Object.keys(secs).find(k => k.startsWith('Embedded BI'));
  return {
    hero: { title: kv[0][1], sub: kv[1][1] },
    about: paras(about.slice(0, cut)),
    focus: parseBullets(about.slice(cut)).map(l => { const m = l.match(/^\*\*(.+?)\*\* — (.+) _\((.+)\)_$/); return { title: m[1], text: m[2], foot: m[3] }; }),
    stats: parseBullets(secs.Stats).map(l => { const m = l.match(/^(\d+)(\S*)\s+(.*)$/); return { value: +m[1], suffix: m[2], label: m[3] }; }),
    recent: paras(secs['Recent Work'])[0],
    bi: { title: bi, lead: paras(secs[bi])[0], features: parseBullets(secs[bi]).filter(l => !/^(Frontend|Backend):/.test(l)), architecture: parseBullets(secs[bi]).filter(l => /^(Frontend|Backend):/.test(l)).map(l => ({ side: l.split(':')[0], points: l.slice(l.indexOf(':') + 1).split('·').map(x => x.trim()) })) },
    connect: parseBullets(secs.Connect).map(l => { const m = l.match(/^\[(.+?)\]\((.+?)\)(?: — image `(.+?)`)?(?: — (.+))?$/); return { name: m[1], url: m[2], image: m[3] || '', note: m[4] || '' }; }),
  };
}

function staticHtml(c) {
  const p = c.profile, o = [];
  o.push(`<header><h1>${esc(p.hero.title)} — Ming Huang</h1><p>${inline(p.hero.sub)}</p></header>`);
  o.push(`<section id="about"><h2>About</h2>${p.about.map(x => `<p>${inline(x)}</p>`).join('')}<ul>${p.focus.map(f => `<li><strong>${esc(f.title)}</strong> — ${esc(f.text)}</li>`).join('')}</ul></section>`);
  o.push(`<ul>${p.stats.map(s => `<li>${s.value}${esc(s.suffix)} ${esc(s.label)}</li>`).join('')}</ul>`);
  o.push('<main>' + c.chapters.map(ch => `<section id="${ch.slug}"><h2>${esc(ch.title)}</h2>${ch.topics.map(t => `<article id="${t.slug}"><h3>${esc(t.title)}</h3><p><strong>Challenge:</strong> ${esc(t.challenge)}</p>${t.what.map(w => `<p>${inline(w)}</p>`).join('')}${t.applications.length ? `<ul>${t.applications.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}${t.extras.filter(e => /^(Demo|Repo|Video)/.test(e.k) && /^https?:/.test(e.v)).map(e => `<p><a href="${esc(e.v)}">${esc(e.k)}</a></p>`).join('')}</article>`).join('')}</section>`).join('') + '</main>');
  o.push(`<section id="bi-platform"><h2>${esc(p.bi.title)}</h2><p>${inline(p.bi.lead)}</p>${p.bi.architecture.map(a => `<h3>${esc(a.side)}</h3><ul>${a.points.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`).join('')}<ul>${p.bi.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></section>`);
  o.push(`<footer><h2>Connect</h2><ul>${p.connect.map(x => `<li><a href="${esc(x.url)}">${esc(x.name)}</a></li>`).join('')}</ul></footer>`);
  return o.join('\n');
}

const chapters = parseContent(read('content.md'));
parseShowcase(read('showcase.md'), chapters);
const content = { chapters, profile: parseProfile(read('profile.md')) };
fs.writeFileSync(path.join(root, 'content.js'), 'const CONTENT = ' + JSON.stringify(content, null, 1) + ';\n');

const idx = path.join(root, 'index.html'); let html = fs.readFileSync(idx, 'utf8');
html = html.replace(/<!-- seo:start -->[\s\S]*<!-- seo:end -->/, `<!-- seo:start -->\n<div id="static">\n${staticHtml(content)}\n</div>\n<!-- seo:end -->`);
fs.writeFileSync(idx, html);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://mingzillastudio.co.uk/2026/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`);
console.log(`content.js: ${chapters.length} chapters, ${chapters.reduce((n, c) => n + c.topics.length, 0)} topics`);
