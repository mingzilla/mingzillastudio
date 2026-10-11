// DiscoveryWidget: documents flow Discovery -> API Harvest -> PDF Download -> Conversion -> Analysis. Analysis stays gated until nothing is missing.
const DiscoveryWidget = {
  draw(host, opts = {}) {
    const ST = ['Discovery', 'API harvest', 'PDF download', 'Conversion', 'Analysis'], N = 56;
    return WidgetKit.scene(host, opts, {
      aria: 'Documents flow through discovery, harvest, download and conversion; analysis waits until coverage is complete', stillClock: 20, narrowAt: 520,
      height: s => s.narrow ? 380 : Math.round(s.W * .34),
      buttons: [['fix', 'Find the missing ones', s => fix(s)]],
      init(s) {
        const rnd = d3.randomLcg(3); s.docs = d3.range(N).map(i => ({ id: i, miss: i % 7 === 3, p: -1 - i * .16, found: false, stage: 0 })); s.gate = false; s.done = 0; s.fixAt = -1; s.nextFix = 7;
        s.g = s.svg.append('g'); s.d = s.svg.append('g'); s.tx = s.svg.append('g');
      },
      layout(s) {
        const x = i => s.narrow ? s.W * .22 : 50 + i * (s.W - 100) / 4, y = i => s.narrow ? 44 + i * (s.H - 130) / 4 : s.H * .46;
        s.pos = i => ({ x: x(i), y: y(i) });
        s.g.selectAll('*').remove();
        for (let i = 0; i < 4; i++) { const a = s.pos(i), b = s.pos(i + 1); s.g.append('line').attr('class', 'ln').attr('x1', a.x).attr('y1', a.y).attr('x2', b.x).attr('y2', b.y); }
        ST.forEach((n, i) => { const p = s.pos(i); s.g.append('circle').attr('class', 'nd').attr('cx', p.x).attr('cy', p.y).attr('r', 6 * s.k).attr('fill', 'none');
          s.g.append('text').attr('class', 'lb').attr('x', s.narrow ? p.x + 16 : p.x).attr('y', s.narrow ? p.y + 3 : p.y + 26 * s.k).attr('text-anchor', s.narrow ? 'start' : 'middle').style('font', '400 9px Jost').style('letter-spacing', '.14em').style('text-transform', 'uppercase').text(n); });
      },
      frame(s, dt) {
        const T = s.T, k = s.k, spd = .55;
        if (!s.still && s.clock > s.nextFix && s.fixAt < 0 && s.docs.some(d => d.miss && !d.found)) { fix(s); }
        s.docs.forEach(d => { d.p += dt * spd * (d.p > 2.2 && d.p < 2.6 && !s.gate ? .25 : 1); if (d.miss && !d.found && d.p > 1.5 && d.p < 1.6) d.p = 1.5; if (d.p > 3.2 && !s.gate) d.p = 3.2; if (d.p >= 4 && !d.done) { d.done = true; s.done++; } });
        if (s.still) s.docs.forEach(d => { d.found = true; d.p = 4; d.done = true; }), s.done = N;
        const miss = s.docs.filter(d => d.miss && !d.found).length, reached = s.docs.filter(d => d.p >= 1.5 || d.found).length;
        s.gate = miss === 0 && s.docs.every(d => d.p >= 1.4);
        const at = p => { const i = Math.max(0, Math.min(3.999, Math.floor(p))), a = s.pos(i), b = s.pos(i + 1), f = Math.min(1, p - i); return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }; };
        const jy = d => (s.narrow ? 0 : ((d.id % 5) - 2) * 7 * k), jx = d => (s.narrow ? ((d.id % 5) - 2) * 7 * k : 0);
        const live = s.docs.filter(d => d.p > 0 && d.p < 4);
        s.d.selectAll('circle').data(live, d => d.id).join('circle').attr('r', 3.2 * k).attr('cx', d => at(d.p).x + jx(d)).attr('cy', d => at(d.p).y + jy(d))
          .attr('fill', d => d.miss && !d.found ? 'none' : T.gold).attr('stroke', d => d.miss && !d.found ? T.bad : 'none').attr('stroke-width', 1.4);
        s.g.selectAll('.ln').attr('stroke', T.line); s.g.selectAll('.nd').attr('stroke', (d, i) => T.gold).attr('fill', (d, i) => i === 4 ? (s.gate ? T.gold : T.panel) : 'none').attr('fill-opacity', .5);
        s.g.selectAll('.lb').attr('fill', T.mute);
        const covered = Math.round((N - miss) / N * 100);
        s.tx.selectAll('text.cv').data([0]).join('text').attr('class', 'cv').attr('x', 4).attr('y', 20).attr('fill', miss ? T.bad : T.good).style('font', '400 10px Jost').style('letter-spacing', '.22em').style('text-transform', 'uppercase')
          .text(miss ? `Coverage ${covered}% · ${miss} missing — analysis is waiting` : 'Coverage 100% · analysis open');
        s.tx.selectAll('text.dn').data([0]).join('text').attr('class', 'dn').attr('x', 4).attr('y', s.H - 10).attr('fill', T.mute).style('font', '400 11px Jost').style('letter-spacing', '.14em').text(`${s.done} documents analysed`);
        s.tx.selectAll('text.big').data([0]).join('text').attr('class', 'big').attr('x', s.W - 4).attr('y', s.H - 10).attr('text-anchor', 'end').attr('fill', T.ink).style('font', '300 28px "Cormorant Garamond", Georgia, serif').text(s.gate ? 'Complete' : 'Waiting');
        if (s.fixAt > 0 && s.clock - s.fixAt > .9) { s.docs.forEach(d => { if (d.miss) { d.found = true; } }); s.fixAt = -1; s.nextFix = s.clock + 12; if (s.done >= N - 1) { s.docs.forEach((d, i) => { d.p = -1 - i * .16; d.done = false; d.found = false; }); s.done = 0; } }
      },
    });
    function fix(s) { if (s.fixAt < 0) s.fixAt = s.clock; }
  },
};
