// TaxWidget: Gmail inbox -> local folder -> normalise -> group -> extract -> verify -> report. Run it twice: nothing is processed again and the report is identical (idempotent).
const TaxWidget = {
  draw(host, opts = {}) {
    const ST = ['Gmail inbox', 'Local folder', 'Normalise', 'Group', 'Extract', 'Verify', 'Report'], TYPES = ['P60', 'Bank', 'Receipt', 'Dividend'], N = 10;
    const hash = ids => { let h = 5381; ids.slice().sort().forEach(i => { h = ((h << 5) + h + i * 7919) >>> 0; }); return h.toString(16).padStart(8, '0').slice(0, 6); };
    return WidgetKit.scene(host, opts, {
      aria: 'Tax documents flow from inbox to report; a second run skips everything already processed and gives the identical report', stillClock: 20, narrowAt: 520,
      height: s => s.narrow ? 400 : Math.round(s.W * .34),
      buttons: [['again', 'Run it again', s => next(s)]],
      init(s) { s.seen = new Set(); s.run = 0; s.docs = []; s.report = []; s.runAt = -9; s.skipped = 0; s.hist = []; s.g = s.svg.append('g'); s.d = s.svg.append('g'); s.tx = s.svg.append('g'); s.started = false; },
      layout(s) {
        const x = i => s.narrow ? s.W * .2 : 40 + i * (s.W - 80) / 6, y = i => s.narrow ? 36 + i * (s.H - 100) / 6 : s.H * .42; s.pos = i => ({ x: x(i), y: y(i) });
        s.g.selectAll('*').remove();
        for (let i = 0; i < 6; i++) { const a = s.pos(i), b = s.pos(i + 1); s.g.append('line').attr('class', 'ln').attr('x1', a.x).attr('y1', a.y).attr('x2', b.x).attr('y2', b.y); }
        ST.forEach((n, i) => { const p = s.pos(i); s.g.append('circle').attr('class', 'nd').attr('cx', p.x).attr('cy', p.y).attr('r', 5 * s.k).attr('fill', 'none');
          s.g.append('text').attr('class', 'lb').attr('x', s.narrow ? p.x + 14 : p.x).attr('y', s.narrow ? p.y + 3 : p.y + 24 * s.k).attr('text-anchor', s.narrow ? 'start' : 'middle').style('font', '400 8.5px Jost').style('letter-spacing', '.1em').style('text-transform', 'uppercase').text(n); });
      },
      frame(s, dt) {
        const T = s.T, k = s.k;
        if (!s.started) { s.started = true; next(s, true); }
        if (s.still && s.run < 2) { s.docs = []; s.run = 1; s.report = d3.range(N); }
        if (!s.still && s.docs.length && s.docs.every(d => d.dead) && s.clock - s.runAt > 5) next(s);
        s.docs.forEach(d => { if (d.dead) return; d.p += dt * .75; if (d.p < 0) return;
          if (d.skip && d.p >= 1.3) { d.dead = true; s.skipped++; return; }
          if (d.id === 5 && s.run === 1 && !d.retried && d.p >= 5.1) { d.retried = true; d.p = 4.2; d.flash = 1; }
          if (d.p >= 6) { d.dead = true; if (!d.skip && !s.report.includes(d.id)) s.report.push(d.id); } d.flash = Math.max(0, (d.flash || 0) - dt); });
        const at = p => { const i = Math.max(0, Math.min(5.999, Math.floor(p))), a = s.pos(i), b = s.pos(i + 1), f = Math.min(1, p - i); return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }; };
        const col = d => d3.interpolateRgb(T.mute, T.gold)((d.id % 4) / 3);
        const live = s.docs.filter(d => !d.dead && d.p >= 0);
        s.d.selectAll('rect').data(live, d => d.id + '-' + d.run).join('rect').attr('width', 8 * k).attr('height', 10 * k)
          .attr('x', d => at(d.p).x - 4 * k + (s.narrow ? ((d.id % 5) - 2) * 6 : 0)).attr('y', d => at(d.p).y - 5 * k + (s.narrow ? 0 : ((d.id % 5) - 2) * 6))
          .attr('fill', d => d.flash > 0 ? T.bad : d.skip ? 'none' : (d.p > 2 ? col(d) : T.ink)).attr('stroke', d => d.skip ? T.mute : 'none').attr('stroke-dasharray', '2 2').attr('fill-opacity', .9).attr('opacity', d => d.skip && d.p > 1 ? Math.max(0, 1 - (d.p - 1) / .3) : 1);
        s.g.selectAll('.ln').attr('stroke', T.line); s.g.selectAll('.nd').attr('stroke', T.gold); s.g.selectAll('.lb').attr('fill', T.mute);
        const h = hash(d3.range(N));
        s.tx.selectAll('text.t1').data([0]).join('text').attr('class', 't1').attr('x', 4).attr('y', 20).attr('fill', T.gold).style('font', '400 10px Jost').style('letter-spacing', '.22em').style('text-transform', 'uppercase')
          .text(s.run <= 1 ? 'Run 1 · everything is new' : 'Run 2 · everything is already known');
        const rp = s.pos(6), done = s.report.length;
        s.tx.selectAll('text.t2').data([0]).join('text').attr('class', 't2').attr('x', 4).attr('y', s.H - 12).attr('fill', T.mute).style('font', '400 11px Jost').style('letter-spacing', '.12em')
          .text(`report items ${done} · skipped ${s.skipped}`);
        s.tx.selectAll('text.t3').data([0]).join('text').attr('class', 't3').attr('x', s.W - 4).attr('y', s.H - 12).attr('text-anchor', 'end').attr('fill', done >= N ? T.good : T.mute).style('font', '300 24px "Cormorant Garamond", Georgia, serif')
          .text(done >= N ? `report #${h}${s.run >= 2 ? ' — unchanged' : ''}` : 'building report…');
      },
    });
    function next(s, first) {
      s.run = s.run >= 2 && !first ? 1 : s.run + 1; if (s.run === 1) { s.seen = new Set(); s.report = []; s.skipped = 0; }
      s.runAt = s.clock; s.docs = d3.range(N).map(i => ({ id: i, run: s.run, p: -i * .55, skip: s.seen.has(i) }));
      s.docs.forEach(d => s.seen.add(d.id));
      s.label('again', s.run >= 2 ? 'Start over' : 'Run it again');
    }
  },
};
