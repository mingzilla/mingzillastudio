// VideoWidget: an hour of video as a timeline of segments. Pick what you care about - the hour collapses to the moments that matter.
const VideoWidget = {
  draw(host, opts = {}) {
    const TOPICS = ['Agents', 'Caching', 'Skills', 'Search'];
    return WidgetKit.scene(host, opts, {
      aria: 'A one-hour video timeline collapsing to the moments relevant to the chosen topic', stillClock: 5, narrowAt: 520,
      height: s => s.narrow ? 360 : Math.round(s.W * .32),
      buttons: TOPICS.map((n, i) => [n, n, s => { s.manual = true; s.topic = s.topic === i ? -1 : i; s.at = s.clock; mark(s); }]),
      init(s) {
        const rnd = d3.randomLcg(12); s.topic = 0; s.manual = false; s.at = 0;
        s.seg = d3.range(60).map(i => ({ i, tags: [Math.floor(rnd() * 4), rnd() < .25 ? Math.floor(rnd() * 4) : -1], x: 0, w: 0, y: 0 }));
        s.g = s.svg.append('g'); s.c = s.svg.append('g'); s.tx = s.svg.append('g'); mark(s);
      },
      frame(s, dt) {
        const T = s.T, k = s.k, t = s.clock;
        if (!s.manual && !s.still && t - s.at > 5) { s.topic = (s.topic + 1) % 4; s.at = t; mark(s); }
        const hit = i => s.seg[i].tags.includes(s.topic), moments = s.seg.filter(d => hit(d.i)), n = s.seg.length, ease = s.still ? 1 : 1 - Math.exp(-dt * 6);
        const bx = 4, bw = s.W - 8, by = 56 * k, bh = 54 * k;
        s.seg.forEach(d => { const wTarget = hit(d.i) ? 1.8 : .35; d.wt = wTarget; });
        const total = d3.sum(s.seg, d => d.wt); let x = bx; s.seg.forEach(d => { d.w = d.w ? d.w + (d.wt / total * bw - d.w) * ease : bw / n; d.x = x; x += d.w; });
        const r = s.g.selectAll('rect').data(s.seg, d => d.i).join('rect');
        r.attr('x', d => d.x + .5).attr('y', by).attr('width', d => Math.max(.5, d.w - 1)).attr('height', bh).attr('fill', d => hit(d.i) ? T.gold : T.mute).attr('fill-opacity', d => hit(d.i) ? .95 : .35);
        // transcript lines under the timeline
        const lines = s.g.selectAll('line.tr').data(d3.range(7)).join('line').attr('class', 'tr').attr('x1', bx).attr('x2', d => bx + bw * (.5 + .45 * Math.abs(Math.sin(d * 2.3 + 1)))).attr('y1', d => by + bh + 22 * k + d * 7 * k).attr('y2', d => by + bh + 22 * k + d * 7 * k).attr('stroke', T.line);
        s.tx.selectAll('*').remove();
        WidgetKit.text(s.tx.append('text'), 10, '.22em').attr('x', 4).attr('y', 20).attr('fill', T.gold).text(`Interested in: ${s.topic < 0 ? 'everything' : TOPICS[s.topic]}`);
        WidgetKit.text(s.tx.append('text'), 11, '.14em').attr('x', 4).attr('y', 38).attr('fill', T.mute).text(`1 hour of video → ${s.topic < 0 ? 'no filter' : moments.length + ' moments'}`);
        WidgetKit.text(s.tx.append('text'), 9, '.2em').attr('x', bx).attr('y', by - 6).attr('fill', T.mute).text('00:00');
        WidgetKit.text(s.tx.append('text'), 9, '.2em').attr('x', bx + bw).attr('y', by - 6).attr('text-anchor', 'end').attr('fill', T.mute).text('60:00');
        const cy = by + bh + 22 * k + 7 * 7 * k + 18 * k;
        moments.slice(0, s.narrow ? 4 : 8).forEach((d, j) => { const cw = s.narrow ? (s.W - 8) / 2 - 4 : (s.W - 8) / 4 - 6, cx = 4 + (j % (s.narrow ? 2 : 4)) * (cw + 8), yy = cy + Math.floor(j / (s.narrow ? 2 : 4)) * 34 * k, mm = Math.round(d.i / n * 60);
          s.tx.append('rect').attr('x', cx).attr('y', yy).attr('width', cw).attr('height', 28 * k).attr('fill', 'none').attr('stroke', T.gold).attr('stroke-opacity', .6);
          WidgetKit.text(s.tx.append('text'), 10, '.14em').attr('x', cx + 8).attr('y', yy + 18 * k).attr('fill', T.ink).text(`${String(mm).padStart(2, '0')}:00 · ${TOPICS[s.topic]}`); });
        s.btn && TOPICS.forEach((n, i) => s.btn[n].style('background', s.topic === i ? T.gold : 'none').style('color', s.topic === i ? T.panel : T.gold));
      },
    });
    function mark(s) { /* hook for later: hover tooltips */ }
  },
};
