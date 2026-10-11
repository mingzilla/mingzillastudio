// DomainWidget: an unfamiliar domain. Research lifts the fog (taxonomy), grows a decision tree, simplifies the formula - then companies drop through the tree.
const DomainWidget = {
  draw(host, opts = {}) {
    return WidgetKit.scene(host, opts, {
      aria: 'Research reveals a taxonomy and a decision tree; companies fall through it to invested or not', stillClock: 14, narrowAt: 520,
      height: s => s.narrow ? 560 : Math.round(s.W * .46),
      buttons: [['drop', 'Drop a company in', s => drop(s)], ['replay', 'Replay research', s => { s.t0 = s.clock; s.balls = []; s.cnt = [0, 0]; }]],
      init(s) {
        const rnd = d3.randomLcg(8); s.t0 = 0; s.balls = []; s.cnt = [0, 0]; s.nextDrop = 6;
        s.cos = d3.range(34).map(i => ({ id: i, gx: rnd(), gy: rnd(), x: 0, y: 0 }));
        s.tree = d3.hierarchy({ q: 'Grant?', children: [{ q: 'Equity?', children: [{ leaf: 1 }, { leaf: 0 }] }, { q: 'Fund?', children: [{ q: 'Matched?', children: [{ leaf: 1 }, { leaf: 0 }] }, { leaf: 0 }] }] });
        s.tree.each((d, i) => { d.id = i; });
        s.gMap = s.svg.append('g'); s.gTree = s.svg.append('g'); s.gBall = s.svg.append('g'); s.gTx = s.svg.append('g');
        s.fogId = 'fog' + Math.random().toString(36).slice(2, 7);
      },
      layout(s) {
        const gap = 24; s.mapB = s.narrow ? { x: 0, y: 44, w: s.W, h: 170 } : { x: 0, y: 44, w: s.W * .42, h: s.H - 110 };
        s.treeB = s.narrow ? { x: 0, y: 270, w: s.W, h: 200 } : { x: s.W * .42 + gap, y: 44, w: s.W * .58 - gap, h: s.H - 110 };
        d3.tree().size([s.treeB.w - 60, s.treeB.h - 40])(s.tree); s.tree.each(d => { d.px = s.treeB.x + 30 + d.x; d.py = s.treeB.y + 20 + d.y; });
        s.cos.forEach(c => { c.x = s.mapB.x + 14 + c.gx * (s.mapB.w - 28); c.y = s.mapB.y + 14 + c.gy * (s.mapB.h - 28); });
        s.gMap.selectAll('*').remove(); s.gTree.selectAll('*').remove();
        s.gMap.append('rect').attr('class', 'mapbox').attr('x', s.mapB.x).attr('y', s.mapB.y).attr('width', s.mapB.w).attr('height', s.mapB.h).attr('fill', 'none');
        s.gMap.selectAll('circle.co').data(s.cos).join('circle').attr('class', 'co').attr('cx', c => c.x).attr('cy', c => c.y).attr('r', 3.2 * s.k).style('cursor', 'pointer').on('click', () => drop(s));
        s.gMap.append('rect').attr('class', 'fog').attr('x', s.mapB.x).attr('y', s.mapB.y).attr('width', s.mapB.w).attr('height', s.mapB.h).style('pointer-events', 'none');
        s.gTree.selectAll('line').data(s.tree.links()).join('line').attr('class', 'tl').attr('x1', l => l.source.px).attr('y1', l => l.source.py).attr('x2', l => l.target.px).attr('y2', l => l.target.py);
        const n = s.gTree.selectAll('g.n').data(s.tree.descendants()).join('g').attr('class', 'n').attr('transform', d => `translate(${d.px},${d.py})`);
        n.append('circle').attr('r', d => d.data.leaf != null ? 9 * s.k : 6 * s.k).attr('fill', 'none');
        n.append('text').attr('text-anchor', 'middle').attr('y', d => d.data.leaf != null ? 24 * s.k : -11 * s.k).style('font', '400 9px Jost').style('letter-spacing', '.12em').text(d => d.data.leaf != null ? (d.data.leaf ? 'INVESTED' : 'NOT') : d.data.q);
      },
      frame(s, dt) {
        const T = s.T, t = s.clock - s.t0, k = s.k;
        const fog = d3.easeCubicInOut(Math.max(0, Math.min(1, t / 3))), tree = Math.max(0, Math.min(1, (t - 3) / 3)), rules = Math.max(0, Math.min(1, (t - 6.5) / 2.5));
        s.gMap.select('.mapbox').attr('stroke', T.line); s.gMap.select('.fog').attr('fill', T.mute).attr('fill-opacity', .5 * (1 - fog));
        s.gMap.selectAll('circle.co').attr('fill', T.gold).attr('fill-opacity', .15 + .85 * fog);
        s.gTree.selectAll('line.tl').attr('stroke', T.line).attr('stroke-opacity', tree).attr('stroke-dasharray', l => 1000).attr('stroke-dashoffset', 1000 * (1 - tree) * 0);
        s.gTree.selectAll('g.n').attr('opacity', d => Math.max(0, Math.min(1, tree * 4 - d.depth * .9)));
        s.gTree.selectAll('g.n circle').attr('stroke', T.gold).attr('fill', d => d.data.leaf === 1 ? T.good : 'none').attr('fill-opacity', .5);
        s.gTree.selectAll('g.n text').attr('fill', T.mute);
        if (!s.still && s.clock > s.nextDrop && t > 9) { drop(s); s.nextDrop = s.clock + 2.2; }
        const speed = 90 * k;
        s.balls.forEach(b => { if (b.done) return; const a = b.path[b.seg], c = b.path[b.seg + 1]; if (!c) { b.done = true; return; } const len = Math.hypot(c.px - a.px, c.py - a.py) || 1; b.d += speed * dt / len; while (b.d >= 1 && b.path[b.seg + 1]) { b.d -= 1; b.seg++; if (!b.path[b.seg + 1]) { b.done = true; s.cnt[b.path[b.seg].data.leaf]++; b.fade = 1; break; } } });
        s.balls = s.balls.filter(b => !b.done || (b.fade -= dt * 1.2) > 0);
        s.gBall.selectAll('circle').data(s.balls).join('circle').attr('r', 4.5 * k).attr('fill', T.ink).attr('opacity', b => b.done ? Math.max(0, b.fade) : 1)
          .attr('cx', b => { const a = b.path[b.seg], c = b.path[Math.min(b.seg + 1, b.path.length - 1)]; return a.px + (c.px - a.px) * Math.min(1, b.d); }).attr('cy', b => { const a = b.path[b.seg], c = b.path[Math.min(b.seg + 1, b.path.length - 1)]; return a.py + (c.py - a.py) * Math.min(1, b.d); });
        const phase = t < 3 ? 'Taxonomy research' : t < 6.5 ? 'Decision tree research' : t < 9 ? 'Formula simplification' : 'Did this company receive investment?';
        const nrules = Math.round(14 - 11 * rules);
        s.gTx.selectAll('text.ph').data([0]).join('text').attr('class', 'ph').attr('x', 2).attr('y', 20).attr('fill', T.gold).style('font', '400 10px Jost').style('letter-spacing', '.22em').style('text-transform', 'uppercase').text(phase);
        s.gTx.selectAll('text.rl').data([0]).join('text').attr('class', 'rl').attr('x', 2).attr('y', s.H - 18).attr('fill', T.mute).style('font', '400 11px Jost').style('letter-spacing', '.14em')
          .text(`rules ${'▪'.repeat(nrules)}   ·   invested ${s.cnt[1]}   ·   not ${s.cnt[0]}`);
      },
    });
    function drop(s) { if (s.clock - s.t0 < 9) { s.t0 = s.clock - 9.2; } const path = [s.tree]; let n = s.tree; while (n.children) { n = n.children[Math.floor(Math.random() * n.children.length)]; path.push(n); } s.balls.push({ path, seg: 0, d: 0 }); }
  },
};
