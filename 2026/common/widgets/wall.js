// WallWidget: a wall of tiles (1 tile = 2,000 websites) being cleaned, prompted and summarised, then grouped by similarity.
//   const w = WallWidget.draw(hostEl, { theme, reduceMotion }); w.setTheme(t); w.destroy();
// Canvas, because there are hundreds of tiles. Hover a tile for its pipeline. The button groups / ungroups by similarity.
const WallWidget = {
  draw(host, opts = {}) {
    let T = opts.theme || WidgetTheme.dark;
    const still = !!opts.reduceMotion;
    const K = 7;
    let SITES = 2000, szNow = 0, W = 0, H = 0, N = 0, cols = 0, s = 0, tiles = [], t = 0, grouped = false, manual = false, phaseAt = 0, sweepEnd = 0, hover = -1, dpr = 1;
    const fmt = d3.format(',');

    const root = d3.select(host).style('position', 'relative');
    const bar = root.append('div').style('display', 'flex').style('gap', '8px').style('margin-bottom', '10px');
    const mk = (txt, fn) => bar.append('button').text(txt).on('click', fn).style('background', 'none').style('border', '1px solid').style('padding', '7px 14px')
      .style('font', '400 10px Jost, sans-serif').style('letter-spacing', '.22em').style('text-transform', 'uppercase').style('cursor', 'pointer');
    const bGroup = mk('', () => { manual = true; grouped = !grouped; label(); });
    mk('Replay', () => { manual = false; restart(); });
    const cv = root.append('canvas').style('display', 'block').style('width', '100%').attr('role', 'img').attr('aria-label', 'Wall of website tiles being summarised, then grouped by similarity').node();
    const ctx = cv.getContext('2d');
    const tip = root.append('div').style('position', 'absolute').style('pointer-events', 'none').style('opacity', 0).style('padding', '10px 12px')
      .style('font', '300 12px/1.5 Jost, sans-serif').style('border', '1px solid').style('max-width', '220px');
    const label = () => bGroup.text(grouped ? 'Ungroup' : 'Group by similarity');

    function layout() {
      W = host.clientWidth || 640; dpr = Math.min(2, window.devicePixelRatio || 1);
      cols = W <= 560 ? 18 : 36; s = Math.floor(W / cols); cols = Math.floor(W / s);
      const rows = W <= 560 ? 20 : 18; N = cols * rows; H = rows * s + 44; SITES = N > 500 ? 2000 : 4000;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rnd = d3.randomLcg(9);
      const centres = d3.range(K).map(i => { const a = i / K * Math.PI * 2 - Math.PI / 2; return [W / 2 + Math.cos(a) * W * .32, (H - 44) / 2 + Math.sin(a) * (H - 44) * .3]; });
      tiles = d3.range(N).map(i => ({ i, gx: (i % cols) * s + s / 2, gy: Math.floor(i / cols) * s + s / 2, c: Math.floor(rnd() * K), t0: i / N * 10, jit: rnd() }));
      tiles.forEach(d => { d.x = d.gx; d.y = d.gy; d.cx = centres[d.c][0]; d.cy = centres[d.c][1]; });
      const sim = d3.forceSimulation(tiles.map(d => ({ x: d.cx + (rnd() - .5) * 20, y: d.cy + (rnd() - .5) * 20, c: d.c }))).randomSource(d3.randomLcg(2))
        .force('x', d3.forceX(d => centres[d.c][0]).strength(.12)).force('y', d3.forceY(d => centres[d.c][1]).strength(.12)).force('col', d3.forceCollide(s * .28)).stop();
      for (let i = 0; i < 260; i++) sim.tick();
      sim.nodes().forEach((n, i) => { tiles[i].tx = n.x; tiles[i].ty = n.y; });
      sweepEnd = 10 + 1.2;
      if (still) { t = 99; grouped = false; }
    }
    function restart() { t = 0; grouped = false; phaseAt = 0; label(); }
    const stageOf = d => Math.max(-1, Math.min(3, (t - d.t0) / .3 - 0));
    const ORDER = [0, 3, 6, 2, 5, 1, 4], shade = c => d3.interpolateRgb(T.mute, T.gold)(ORDER[c] / (K - 1));

    function draw(dt) {
      if (!still) {
        t += dt;
        if (!manual) { if (!grouped && t > sweepEnd + 1 && t < sweepEnd + 1.1) grouped = true, label(); if (grouped && t > sweepEnd + 9) grouped = false, label(); if (t > sweepEnd + 12) restart(); }
      }
      const ease = 1 - Math.exp(-dt * 6);
      ctx.clearRect(0, 0, W, H);
      const szT = grouped ? s * .5 : s - 2; szNow = szNow ? szNow + (szT - szNow) * (still ? 1 : ease) : szT; let done = 0; const sz = szNow;
      tiles.forEach(d => {
        const gx = grouped ? d.tx : d.gx, gy = grouped ? d.ty : d.gy;
        d.x += (gx - d.x) * (still ? 1 : ease); d.y += (gy - d.y) * (still ? 1 : ease);
        const st = stageOf(d); if (st >= 3) done++;
        const x = d.x - sz / 2, y = d.y - sz / 2;
        if (st < 0) { ctx.strokeStyle = T.faint; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, sz - 1, sz - 1); }
        else if (st < 1) { ctx.strokeStyle = T.gold; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, sz - 1, sz - 1); }
        else if (st < 3) { ctx.fillStyle = T.mute; ctx.globalAlpha = .25 + .3 * (st - 1); ctx.fillRect(x, y, sz, sz); ctx.globalAlpha = 1; ctx.strokeStyle = T.gold; ctx.strokeRect(x + .5, y + .5, sz - 1, sz - 1); }
        else { ctx.fillStyle = grouped ? shade(d.c) : T.gold; ctx.globalAlpha = grouped ? .95 : .55 + .35 * d.jit; ctx.fillRect(x, y, sz, sz); ctx.globalAlpha = 1; }
        if (d.i === hover) { ctx.strokeStyle = T.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x - 1, y - 1, sz + 2, sz + 2); }
      });
      ctx.fillStyle = T.mute; ctx.font = '400 11px Jost, sans-serif';
      ctx.fillText(`${fmt(done * SITES)} websites summarised   ·   1 tile = ${fmt(SITES)} sites   ·   1.5 s per site`, 4, H - 16);
      bar.selectAll('button').style('color', T.gold).style('border-color', T.gold);
    }
    function onMove(e) {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = -1, bd = s;
      tiles.forEach(d => { const dd = Math.hypot(d.x - x, d.y - y); if (dd < bd) { bd = dd; best = d.i; } });
      hover = best;
      if (best < 0) { tip.style('opacity', 0); return; }
      const d = tiles[best], st = stageOf(d), name = st < 0 ? 'waiting' : st < 1 ? 'cleaning text' : st < 2 ? 'prompting' : st < 3 ? 'summarising' : 'summarised';
      tip.html(`<div style="font:400 10px Jost;letter-spacing:.2em;text-transform:uppercase;color:${T.gold};margin-bottom:4px">tile ${best + 1} · ${fmt(SITES)} sites</div>Web text → Clean → Prompt → Summary<br><span style="color:${T.mute}">${name}${grouped ? ' · similarity group ' + (d.c + 1) : ''}</span>`)
        .style('background', T.panel).style('color', T.ink).style('border-color', T.gold)
        .style('left', Math.min(W - 230, Math.max(4, x + 14)) + 'px').style('top', (y + 60) + 'px').style('opacity', 1);
    }
    cv.addEventListener('pointermove', onMove); cv.addEventListener('pointerleave', () => { hover = -1; tip.style('opacity', 0); });
    label(); layout();
    const ro = new ResizeObserver(layout); ro.observe(host);
    let last = performance.now();
    const timer = d3.timer(now => { const dt = Math.min(.1, (now - last) / 1000); last = now; draw(dt); });
    return { setTheme(x) { T = x; }, destroy() { timer.stop(); ro.disconnect(); root.selectAll('*').remove(); } };
  },
};
