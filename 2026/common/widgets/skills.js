// SkillsWidget: 50+ skills as a living cloud. Rings = dependency layers (Core -> General -> Workflow); islands = Operational / Authoring / Projects.
// Click a skill to light up everything it depends on and everything that depends on it.
const SkillsWidget = {
  draw(host, opts = {}) {
    const LAYERS = ['Core', 'General', 'Workflow'], ISL = ['Operational', 'Authoring', 'Projects'];
    return WidgetKit.scene(host, opts, {
      aria: 'Fifty-plus skills in dependency layers, splitting into operational, authoring and project islands', stillClock: 4,
      height: s => s.narrow ? 460 : Math.round(s.W * .46),
      buttons: [['mode', 'Split into islands', s => { s.manual = true; s.mode = s.mode === 'rings' ? 'islands' : 'rings'; s.label('mode', s.mode === 'rings' ? 'Split into islands' : 'Back to layers'); }]],
      init(s) {
        const rnd = d3.randomLcg(21); s.mode = 'rings'; s.manual = false; s.sel = -1; s.nextPick = 2; let id = 0; s.skills = [];
        [8, 18, 28].forEach((n, l) => d3.range(n).forEach(i => s.skills.push({ id: id++, l, i, n, isl: rnd() < .4 ? 0 : rnd() < .55 ? 1 : 2, x: 0, y: 0, deps: [], by: [] })));
        s.skills.filter(d => d.l > 0).forEach(d => { const pool = s.skills.filter(x => x.l === d.l - 1); d.deps = d3.shuffle(pool.slice(), rnd).slice(0, 1 + Math.floor(rnd() * 2)).map(x => x.id); d.deps.forEach(p => s.skills[p].by.push(d.id)); });
        s.gLink = s.svg.append('g'); s.gDot = s.svg.append('g'); s.gTxt = s.svg.append('g'); s.hud = WidgetKit.text(s.svg.append('text'), 11);
        s.chain = id0 => { const set = new Set([id0]); const up = i => s.skills[i].deps.forEach(p => { if (!set.has(p)) { set.add(p); up(p); } }); const dn = i => s.skills[i].by.forEach(p => { if (!set.has(p)) { set.add(p); dn(p); } }); up(id0); dn(id0); return set; };
      },
      layout(s) {
        const m = Math.min(s.W, s.H); s.cx = s.W / 2; s.cy = s.H / 2 - 6; s.R = [.11, .25, .4].map(f => f * m * (s.narrow ? 1.05 : 1.1));
        s.isl = s.narrow ? [[.5, .2], [.28, .62], [.74, .72]] : [[.2, .5], [.5, .5], [.8, .5]];
        s.gTxt.selectAll('*').remove(); s.hud.attr('x', 4).attr('y', s.H - 8);
      },
      frame(s, dt) {
        const t = s.clock, T = s.T, k = s.k;
        if (!s.manual && !s.still) s.mode = Math.floor(t / 10) % 2 ? 'islands' : 'rings';
        if (!s.still && t > s.nextPick) { const pool = s.skills.filter(d => d.l > 0); s.sel = pool[Math.floor(Math.random() * pool.length)].id; s.nextPick = t + 4; }
        if (s.still && s.sel < 0) s.sel = 40;
        const ease = s.still ? 1 : 1 - Math.exp(-dt * 5), chain = s.sel >= 0 ? s.chain(s.sel) : null, cnt = [0, 0, 0];
        s.skills.forEach(d => {
          let tx, ty;
          if (s.mode === 'rings') { const a = d.i / d.n * Math.PI * 2 + t * [.05, -.07, .045][d.l] + d.l; tx = s.cx + Math.cos(a) * s.R[d.l]; ty = s.cy + Math.sin(a) * s.R[d.l] * (s.narrow ? 1 : .86); }
          else { const j = cnt[d.isl]++, c = s.isl[d.isl], r = 7.2 * k * Math.sqrt(j + 1), a = j * 2.39996 + t * .1; tx = c[0] * s.W + Math.cos(a) * r; ty = c[1] * s.H + Math.sin(a) * r; }
          d.x = d.x ? d.x + (tx - d.x) * ease : tx; d.y = d.y ? d.y + (ty - d.y) * ease : ty;
        });
        const dim = d => chain && !chain.has(d.id);
        const col = d => d.l === 0 ? T.gold : d.l === 1 ? T.ink : T.mute;
        const c = s.gDot.selectAll('circle').data(s.skills, d => d.id).join(e => e.append('circle').style('cursor', 'pointer').on('click', (ev, d) => { s.manual = true; s.sel = s.sel === d.id ? -1 : d.id; s.nextPick = 1e9; }));
        c.attr('cx', d => d.x).attr('cy', d => d.y).attr('r', d => (d.id === s.sel ? 7 : [5.2, 4.2, 3.4][d.l]) * k).attr('fill', col).attr('fill-opacity', d => dim(d) ? .15 : d.l === 2 ? .7 : .95)
          .attr('stroke', d => d.id === s.sel ? T.ink : 'none').attr('stroke-width', 1.5);
        const links = chain ? s.skills.flatMap(d => d.deps.filter(p => chain.has(d.id) && chain.has(p)).map(p => [s.skills[p], d])) : [];
        s.gLink.selectAll('line').data(links).join('line').attr('x1', d => d[0].x).attr('y1', d => d[0].y).attr('x2', d => d[1].x).attr('y2', d => d[1].y).attr('stroke', T.gold).attr('stroke-opacity', .6);
        const labs = s.mode === 'rings' ? LAYERS.map((n, l) => ({ n, x: s.cx, y: s.cy - s.R[l] * (s.narrow ? 1 : .86) - 11 * k, o: 1 })) : ISL.map((n, i) => ({ n, x: s.isl[i][0] * s.W, y: s.isl[i][1] * s.H - 62 * k, o: 1 }));
        s.gTxt.selectAll('text').data(labs, d => d.n).join('text').attr('x', d => d.x).attr('y', d => d.y).attr('text-anchor', 'middle').attr('fill', T.mute)
          .style('font', '400 9px Jost').style('letter-spacing', '.22em').style('text-transform', 'uppercase').text(d => d.n);
        const nm = s.sel >= 0 ? ` · ${LAYERS[s.skills[s.sel].l]} skill touches ${chain.size - 1} others` : '';
        s.hud.attr('fill', T.mute).text(`${s.skills.length} skills${nm}`);
      },
    });
  },
};
