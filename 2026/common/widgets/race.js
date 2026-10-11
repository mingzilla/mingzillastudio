// RaceWidget: "5 minutes vs millions" for PDF text -> tables. Framework-free.
//   const w = RaceWidget.draw(hostEl, { theme, reduceMotion }); w.setTheme(t); w.destroy();
// Top lane: an LLM reads one record at a time, 5 min each. Bottom lane: classify -> split -> extract with code,
// the LLM only handles the long tail (~12%). Same 1,000,000 records. 1 dot = 5,000 records.
const RaceWidget = {
  draw(host, opts = {}) {
    let T = opts.theme || WidgetTheme.dark;
    const still = !!opts.reduceMotion;
    const TOTAL = 1e6, BATCH = 5000, SLOW = 4.4;            // slow lane: 1 record per 4.4 s (= 5 min, sped up)
    let parts = [], t = 0, spawned = 0, spawnAcc = 0, fastDone = 0, holdUntil = -1, W = 0, H = 0, narrow = false, k = 1;
    const fmt = d3.format(',');

    const root = d3.select(host).style('position', 'relative');
    const svg = root.append('svg').style('display', 'block').style('width', '100%').attr('role', 'img').attr('aria-label', 'Race: one record at a time by LLM versus classify, split and extract with code');
    const g = svg.append('g'), gP = svg.append('g'), tx = svg.append('g');
    const f = (s, y, size, ls) => tx.append('text').style('font', `400 ${size}px Jost`).style('letter-spacing', ls || '.14em');

    const X = i => 36 + i * (W - 72) / 4;
    const yS = () => H * .2, yF = () => H * .62;

    function layout() {
      W = host.clientWidth || 640; narrow = W <= 560; k = narrow ? .9 : Math.max(.85, Math.min(1.1, W / 720));
      H = narrow ? 400 : Math.round(W * .4); svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H); build();
    }
    function build() {
      g.selectAll('*').remove(); tx.selectAll('*').remove();
      // slow lane
      g.append('line').attr('class', 'ln').attr('x1', X(0)).attr('x2', X(4)).attr('y1', yS()).attr('y2', yS());
      g.append('rect').attr('class', 'box').attr('x', X(2) - 22 * k).attr('y', yS() - 18 * k).attr('width', 44 * k).attr('height', 36 * k).attr('rx', 3).attr('fill', 'none');
      f().attr('class', 't mute').attr('x', X(2)).attr('y', yS() + 34 * k).attr('text-anchor', 'middle').style('font-size', '9px').text('LLM');
      f().attr('class', 't gold').attr('x', X(0)).attr('y', yS() - (narrow ? 50 : 38) * k).style('font-size', narrow ? '9px' : '10px').text(narrow ? 'One record at a time · 5 min each' : 'LLM on every record — 5 minutes each');
      // fast lane
      g.append('line').attr('class', 'ln').attr('x1', X(0)).attr('x2', X(4)).attr('y1', yF()).attr('y2', yF());
      ['Files', 'Classify', 'Split', 'Extract', 'Table'].forEach((n, i) => {
        g.append('circle').attr('class', 'dot').attr('cx', X(i)).attr('cy', yF()).attr('r', 5 * k).attr('fill', 'none');
        f().attr('class', 't mute').attr('x', X(i)).attr('y', yF() + 24 * k).attr('text-anchor', 'middle').style('font-size', '9px').style('text-transform', 'uppercase').text(n);
      });
      g.append('rect').attr('class', 'box').attr('x', X(3) - 22 * k).attr('y', yF() + 44 * k).attr('width', 44 * k).attr('height', 26 * k).attr('rx', 3).attr('fill', 'none').attr('stroke-dasharray', '3 3');
      f().attr('class', 't mute').attr('x', X(3)).attr('y', yF() + 62 * k).attr('text-anchor', 'middle').style('font-size', '9px').text('LLM · tail');
      f().attr('class', 't gold').attr('x', X(0)).attr('y', yF() - (narrow ? 52 : 40) * k).style('font-size', narrow ? '9px' : '10px').text(narrow ? 'Rules + shards · LLM for the tail' : 'Research → rules → shards → extract (LLM only for the long tail)');
      if (!narrow) f().attr('class', 't mute').attr('x', X(1)).attr('y', yF() - 20 * k).attr('text-anchor', 'middle').style('font-size', '8px').text('type · format · generation');
      f().attr('class', 'hudl mute').attr('x', 4).attr('y', H - 8).style('font-size', '10px');
      paint();
    }
    function paint() {
      g.selectAll('.ln').attr('stroke', T.line); g.selectAll('.box').attr('stroke', T.line); g.selectAll('.dot').attr('stroke', T.gold);
      tx.selectAll('.mute').attr('fill', T.mute); tx.selectAll('.gold').attr('fill', T.gold);
    }

    function spawn() {
      const tail = Math.random() < .12, y = yF();
      const path = tail ? [[X(0), y], [X(1), y], [X(3), y + 58 * k], [X(4), y]] : [[X(0), y], [X(1), y], [X(2), y]];
      parts.push({ path, seg: 0, d: 0, x: X(0), y, tail, speed: (tail ? 70 : 150) * k * (W / 700), n: BATCH, r: tail ? 3.6 : 3.2 });
      spawned++;
    }
    function move(p, dt) {
      let left = p.speed * dt;
      while (left > 0 && p.seg < p.path.length - 1) {
        const a = p.path[p.seg], b = p.path[p.seg + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, rest = len - p.d;
        if (left >= rest) { left -= rest; p.seg++; p.d = 0; } else { p.d += left; left = 0; }
      }
      if (p.seg >= p.path.length - 1) { p.done = true; p.x = p.path[p.path.length - 1][0]; p.y = p.path[p.path.length - 1][1]; return; }
      const a = p.path[p.seg], b = p.path[p.seg + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      p.x = a[0] + (b[0] - a[0]) * p.d / len; p.y = a[1] + (b[1] - a[1]) * p.d / len;
    }
    function step(dt) {
      t += dt;
      if (holdUntil > 0) { if (t >= holdUntil) reset(); return; }
      const rate = Math.min(34, 5 + t * 2.6);
      if (spawned < TOTAL / BATCH) { spawnAcc += rate * dt; while (spawnAcc >= 1 && spawned < TOTAL / BATCH) { spawn(); spawnAcc--; } }
      const kids = [];
      parts.forEach(p => {
        move(p, dt);
        if (p.done && !p.tail && !p.fin && p.path.length === 3) {          // reached Split: break into 3 shards
          p.fin = true; p.dead = true;
          for (let c = 0; c < 3; c++) kids.push({ path: [[X(2), yF()], [X(3), yF() + (c - 1) * 15 * k], [X(4), yF()]], seg: 0, d: 0, x: X(2), y: yF(), tail: false, speed: p.speed * 1.1, n: BATCH / 3, r: 2.2, fin: true });
        } else if (p.done && !p.dead) { fastDone += p.n; p.dead = true; }
      });
      parts = parts.filter(p => !p.dead).concat(kids);
      if (fastDone >= TOTAL - 1 && !parts.length) holdUntil = t + 4;
    }
    function reset() { parts = []; t = 0; spawned = 0; spawnAcc = 0; fastDone = 0; holdUntil = -1; }

    function draw() {
      const s = gP.selectAll('circle').data(parts);
      s.enter().append('circle').merge(s).attr('cx', p => p.x).attr('cy', p => p.y).attr('r', p => p.r * k)
        .attr('fill', p => p.tail ? 'none' : T.gold).attr('stroke', p => p.tail ? T.ink : 'none').attr('stroke-width', 1.2);
      s.exit().remove();
      // slow lane record
      const slowDone = Math.floor(t / SLOW), ph = (t % SLOW), yS0 = yS();
      const rx = ph < .5 ? X(0) + (X(2) - X(0)) * ph / .5 : ph < 3.9 ? X(2) : X(2) + (X(4) - X(2)) * (ph - 3.9) / .5;
      const rec = gP.selectAll('.rec').data([0]).join('circle').attr('class', 'rec').attr('cx', rx).attr('cy', yS0).attr('r', 5 * k).attr('fill', T.ink);
      const arc = d3.arc().innerRadius(11 * k).outerRadius(13 * k).startAngle(0);
      gP.selectAll('.prog').data([0]).join('path').attr('class', 'prog').attr('transform', `translate(${X(2)},${yS0})`).attr('fill', T.gold)
        .attr('d', arc.endAngle(ph > .5 && ph < 3.9 ? (ph - .5) / 3.4 * Math.PI * 2 : 0)());
      // table fill + counters
      const tb = gP.selectAll('.tbl').data([0]).join('rect').attr('class', 'tbl').attr('x', X(4) + 12 * k).attr('width', 6 * k).attr('fill', T.good).attr('fill-opacity', .8);
      const th = 44 * k * Math.min(1, fastDone / TOTAL); tb.attr('y', yF() + 22 * k - th).attr('height', th);
      const done = fastDone >= TOTAL - 1;
      tx.selectAll('.cs').data([0]).join('text').attr('class', 'cs').attr('x', X(4)).attr('y', yS0 - (narrow ? 26 : 22) * k).attr('text-anchor', 'end').attr('fill', T.ink)
        .style('font', `300 ${narrow ? 18 : 24}px "Cormorant Garamond", Georgia, serif`).text(`${fmt(slowDone)} ${slowDone === 1 ? 'record' : 'records'}`);
      tx.selectAll('.cf').data([0]).join('text').attr('class', 'cf').attr('x', X(4)).attr('y', yF() - (narrow ? 28 : 20) * k).attr('text-anchor', 'end').attr('fill', done ? T.good : T.ink)
        .style('font', `300 ${narrow ? 18 : 24}px "Cormorant Garamond", Georgia, serif`).text(done ? '1,000,000 done' : `${fmt(Math.round(fastDone / 1000) * 1000)} records`);
      tx.select('.hudl').text(narrow ? '1 dot = 5,000 records · by LLM alone: 9.5 years' : '1,000,000 records  ·  LLM on each, 5 min apiece = 9.5 years  ·  1 dot = 5,000 records');
    }

    layout();
    if (still) { for (let i = 0; i < 600; i++) { step(.05); if (holdUntil > 0) break; } holdUntil = -1; }
    const ro = new ResizeObserver(layout); ro.observe(host);
    let last = 0;   // d3.timer passes ms elapsed since the timer started
    const timer = d3.timer(now => { const dt = Math.min(.1, (now - last) / 1000); last = now; if (!still) step(dt); draw(); });
    return { setTheme(x) { T = x; paint(); }, destroy() { timer.stop(); ro.disconnect(); root.selectAll('*').remove(); } };
  },
};
