// UiAutoWidget: a mock app (Screen / Panel / Button) and the automation layers above it (Flow / Task / Wrapper).
// Change the UI: the elements move, only the wrapper links blink - flows and tasks stay green. Nothing is rewritten.
const UiAutoWidget = {
  draw(host, opts = {}) {
    const BTN = ['Login', 'Search', 'Save'], LAY = [[0, 1, 2], [2, 0, 1], [1, 2, 0]];
    return WidgetKit.scene(host, opts, {
      aria: 'A mock app changes its layout; only the wrapper layer re-links while flows and tasks stay green', stillClock: 3, narrowAt: 520,
      height: s => s.narrow ? 520 : Math.round(s.W * .42),
      buttons: [['chg', 'Change the UI', s => change(s)]],
      init(s) { s.lay = 0; s.chgAt = -9; s.nextChg = 6; s.step = 0; s.stepAt = 0; s.runs = 0; s.g = s.svg.append('g'); s.a = s.svg.append('g'); s.tx = s.svg.append('g'); },
      layout(s) { s.appB = s.narrow ? { x: 0, y: 40, w: s.W, h: 170 } : { x: 0, y: 40, w: s.W * .5, h: s.H - 70 }; s.autB = s.narrow ? { x: 0, y: 250, w: s.W, h: 210 } : { x: s.W * .55, y: 40, w: s.W * .45, h: s.H - 70 }; },
      frame(s, dt) {
        const T = s.T, k = s.k, t = s.clock, ab = s.appB, ub = s.autB;
        if (!s.still && t > s.nextChg) { change(s); s.nextChg = t + 9; }
        const since = t - s.chgAt, blink = since > 0 && since < 2.4 ? .5 + .5 * Math.sin(since * 12) : 0;
        if (!s.still && t - s.stepAt > 1.1) { s.step = (s.step + 1) % 4; s.stepAt = t; if (s.step === 0) s.runs++; }
        // app mock: three buttons inside a panel inside a screen; layout permutations place them differently
        const lay = LAY[s.lay], pw = ab.w - 36 * k, ph = ab.h - 56 * k, bw = Math.min(110 * k, pw / 3 - 8), bh = 30 * k;
        const bpos = i => { const slot = lay.indexOf(i); return s.narrow || s.lay % 2 === 0 ? { x: ab.x + 18 * k + 8 + slot * (bw + 10), y: ab.y + 70 * k } : { x: ab.x + 26 * k, y: ab.y + 52 * k + slot * (bh + 14) }; };
        s.a.selectAll('*').remove();
        s.a.append('rect').attr('x', ab.x).attr('y', ab.y).attr('width', ab.w).attr('height', ab.h).attr('fill', 'none').attr('stroke', T.line);
        WidgetKit.text(s.a.append('text'), 9, '.2em').attr('x', ab.x + 10).attr('y', ab.y + 16).attr('fill', T.mute).text('SCREEN');
        s.a.append('rect').attr('x', ab.x + 14 * k).attr('y', ab.y + 28 * k).attr('width', pw).attr('height', ph).attr('fill', 'none').attr('stroke', T.line).attr('stroke-dasharray', '3 3');
        WidgetKit.text(s.a.append('text'), 9, '.2em').attr('x', ab.x + 22 * k).attr('y', ab.y + 44 * k).attr('fill', T.mute).text('PANEL');
        BTN.forEach((n, i) => { const p = bpos(i), active = s.step - 1 === i;
          s.a.append('rect').attr('x', p.x).attr('y', p.y).attr('width', bw).attr('height', bh).attr('rx', 2).attr('fill', active ? T.gold : 'none').attr('fill-opacity', .55).attr('stroke', T.gold);
          WidgetKit.text(s.a.append('text'), 10, '.1em').attr('x', p.x + bw / 2).attr('y', p.y + bh / 2 + 3).attr('text-anchor', 'middle').attr('fill', T.ink).text(n); });
        // automation layers
        const lx = ub.x, lw = ub.w, ly = j => ub.y + 18 + j * ((ub.h - 40) / 3);
        const rows = [['Flow', 'login → search → save'], ['Task', BTN.join(' · ')], ['Wrapper', 'links to elements']];
        s.tx.selectAll('*').remove();
        rows.forEach(([n, sub], j) => {
          const y = ly(j), w = lw - 4, h = 40 * k, hot = j === 2 && blink > 0;
          s.tx.append('rect').attr('x', lx + 2).attr('y', y).attr('width', w).attr('height', h).attr('rx', 3).attr('fill', 'none').attr('stroke', hot ? '#d19b4a' : T.good).attr('stroke-width', hot ? 1 + blink * 1.8 : 1);
          WidgetKit.text(s.tx.append('text'), 10, '.22em').attr('x', lx + 14).attr('y', y + 17).attr('fill', hot ? '#d19b4a' : T.gold).text(n.toUpperCase());
          WidgetKit.text(s.tx.append('text'), 11, '.06em').attr('x', lx + 14).attr('y', y + 32).attr('fill', T.mute).text(sub);
          s.tx.append('text').attr('x', lx + w - 8).attr('y', y + 24).attr('text-anchor', 'end').attr('fill', hot ? '#d19b4a' : T.good).style('font', '400 16px Jost').text(hot ? '↻' : '✓');
        });
        // wrapper -> element links (curves)
        BTN.forEach((n, i) => { const p = bpos(i), wy = ly(2) + 20 * k, from = s.narrow ? [lx + 40 + i * 30, ly(2)] : [lx + 2, wy], to = s.narrow ? [p.x + bw / 2, p.y + bh] : [p.x + bw, p.y + bh / 2];
          s.tx.append('path').attr('d', s.narrow ? `M${from[0]},${from[1]} C${from[0]},${from[1] - 60} ${to[0]},${to[1] + 60} ${to[0]},${to[1]}` : d3.linkHorizontal()({ source: from, target: to }))
            .attr('fill', 'none').attr('stroke', blink > 0 ? '#d19b4a' : T.line).attr('stroke-opacity', blink > 0 ? .5 + blink * .5 : .8).attr('stroke-width', blink > 0 ? 1.6 : 1); });
        s.tx.append('text').attr('x', 4).attr('y', s.H - 10).attr('fill', T.mute).style('font', '400 11px Jost').style('letter-spacing', '.14em')
          .text(`layout v${s.lay + 1} · tests rewritten: 0 · runs: ${s.runs}`);
        s.tx.append('text').attr('x', 4).attr('y', 20).attr('fill', blink > 0 ? '#d19b4a' : T.gold).style('font', '400 10px Jost').style('letter-spacing', '.22em').text(blink > 0 ? 'UI changed — wrapper re-links, flows untouched' : 'The bot runs the flow');
      },
    });
    function change(s) { s.lay = (s.lay + 1) % LAY.length; s.chgAt = s.clock; }
  },
};
