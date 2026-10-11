// ChangesWidget: change detection control. The same data changes hit two UIs: one redraws everything, one redraws only components whose inputs changed.
const ChangesWidget = {
  draw(host, opts = {}) {
    const N = 20;
    return WidgetKit.scene(host, opts, {
      aria: 'Two grids of components receiving the same data changes; one redraws everything, the other only what changed', stillClock: 6, narrowAt: 520,
      height: s => s.narrow ? 470 : Math.round(s.W * .3),
      buttons: [['go', 'Change some data', s => update(s, 2 + Math.floor(Math.random() * 3))]],
      init(s) { s.v = d3.range(N).map(() => 0); s.flash = { A: d3.range(N).map(() => 0), B: d3.range(N).map(() => 0) }; s.cnt = { A: 0, B: 0 }; s.upd = 0; s.next = 1; s.g = s.svg.append('g'); s.tx = s.svg.append('g'); },
      layout(s) { s.boxes = s.narrow ? [{ x: 0, y: 40, w: s.W, h: 150 }, { x: 0, y: 260, w: s.W, h: 150 }] : [{ x: 0, y: 40, w: s.W * .48, h: s.H - 80 }, { x: s.W * .52, y: 40, w: s.W * .48, h: s.H - 80 }]; },
      frame(s, dt) {
        const T = s.T, t = s.clock;
        if (!s.still && t > s.next) { update(s, 1 + Math.floor(Math.random() * 2)); s.next = t + .9; }
        if (s.still && !s.upd) { for (let i = 0; i < 6; i++) update(s, 2); }
        ['A', 'B'].forEach(m => s.flash[m] = s.flash[m].map(f => Math.max(0, f - dt * 1.8)));
        const cols = 5, rows = 4;
        s.g.selectAll('*').remove(); s.tx.selectAll('*').remove();
        ['A', 'B'].forEach((m, bi) => { const b = s.boxes[bi], gw = (b.w - 4 * 6) / cols, gh = (b.h - 3 * 6) / rows;
          d3.range(N).forEach(i => { const x = b.x + (i % cols) * (gw + 6), y = b.y + Math.floor(i / cols) * (gh + 6), f = s.flash[m][i];
            s.g.append('rect').attr('x', x).attr('y', y).attr('width', gw).attr('height', gh).attr('fill', T.gold).attr('fill-opacity', .08 + f * .85).attr('stroke', T.line);
            WidgetKit.text(s.g.append('text'), 10, '.06em').attr('x', x + gw / 2).attr('y', y + gh / 2 + 3).attr('text-anchor', 'middle').attr('fill', f > .3 ? T.panel : T.mute).text(s.v[i]); });
          WidgetKit.text(s.tx.append('text'), 10, '.22em').attr('x', b.x + 2).attr('y', 20).attr('fill', T.gold).text(m === 'A' ? 'Redraw everything' : 'Change detection guard');
          s.tx.append('text').attr('x', b.x + 2).attr('y', b.y + b.h + 28).attr('fill', m === 'A' ? T.bad : T.good).style('font', '300 34px "Cormorant Garamond", Georgia, serif').text(s.cnt[m]);
          WidgetKit.text(s.tx.append('text'), 9, '.2em').attr('x', b.x + 2 + String(s.cnt[m]).length * 17 + 10).attr('y', b.y + b.h + 27).attr('fill', T.mute).text('REDRAWS'); });
      },
    });
    function update(s, n) { s.upd++; const ids = d3.shuffle(d3.range(N)).slice(0, n); ids.forEach(i => { s.v[i]++; s.flash.B[i] = 1; }); s.cnt.B += n; s.cnt.A += N; d3.range(N).forEach(i => { s.flash.A[i] = 1; }); }
  },
};
