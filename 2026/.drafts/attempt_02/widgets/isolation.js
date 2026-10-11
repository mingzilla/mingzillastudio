// IsolationWidget: the same small requirement change in two codebases.
//   const w = IsolationWidget.draw(hostEl, { theme, reduceMotion }); w.setTheme(t); w.destroy();
// Left: coupled files - the change ripples along every dependency. Right: WHAT -> HOW -> CASE - it stays in one branch.
const IsolationWidget = {
  draw(host, opts = {}) {
    let T = opts.theme || WidgetTheme.dark;
    const still = !!opts.reduceMotion;
    const N = 13;
    const rnd = d3.randomLcg(5);

    // left model: 13 files with many dependencies
    const links = [];
    for (let i = 0; i < N; i++) {
      links.push([i, (i + 1) % N]);
      if (rnd() < .85) links.push([i, (i + 4) % N]);
      if (rnd() < .6) links.push([i, (i + 6) % N]);
    }
    const adj = d3.range(N).map(() => []);
    links.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    // right model: WHAT -> 3 HOW -> 3 CASE each
    const tree = d3.hierarchy({ name: 'WHAT', children: d3.range(3).map(h => ({ name: 'HOW ' + (h + 1), children: d3.range(3).map(c => ({ name: 'CASE' })) })) });
    tree.each((d, i) => { d.id = i; });
    const rNodes = tree.descendants(), leaves = rNodes.filter(d => !d.children);

    const root = d3.select(host).style('position', 'relative');
    const bar = root.append('div').style('margin-bottom', '10px');
    const btn = bar.append('button').text('Change a requirement').style('background', 'none').style('border', '1px solid').style('padding', '7px 14px')
      .style('font', '400 10px Jost, sans-serif').style('letter-spacing', '.22em').style('text-transform', 'uppercase').style('cursor', 'pointer');
    const svg = root.append('svg').style('display', 'block').style('width', '100%').attr('role', 'img').attr('aria-label', 'A requirement change ripples through coupled code but stays in one branch with the harness');
    const gL = svg.append('g'), gR = svg.append('g'), gT = svg.append('g');

    let W = 0, H = 0, narrow = false, k = 1, clock = 0, nextRun = .8, endAt = Infinity;
    let boxL, boxR, lPos = [], due = { L: {}, R: {} };

    function layout() {
      W = host.clientWidth || 640; narrow = W <= 560; k = narrow ? .95 : Math.max(.85, Math.min(1.1, W / 720));
      H = narrow ? 660 : Math.round(W * .46);
      svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H);
      const top = 34, gap = 16;
      if (narrow) { const h = 220, block = 330; boxL = { x: 0, y: top, w: W, h }; boxR = { x: 0, y: top + block, w: W, h }; }
      else { const w = (W - gap) / 2, h = H - top - 60; boxL = { x: 0, y: top, w, h }; boxR = { x: w + gap, y: top, w, h }; }
      // left: relax a force layout offline (deterministic), then fit to the box
      const sn = d3.range(N).map(i => ({ id: i }));
      const sim = d3.forceSimulation(sn).randomSource(d3.randomLcg(3)).force('l', d3.forceLink(links.map(([s, t]) => ({ source: s, target: t }))).distance(40).strength(.5))
        .force('c', d3.forceManyBody().strength(-110)).force('x', d3.forceX(0).strength(.05)).force('y', d3.forceY(0).strength(.05)).stop();
      for (let i = 0; i < 300; i++) sim.tick();
      const ex = d3.extent(sn, d => d.x), ey = d3.extent(sn, d => d.y), pad = 34 * k;
      lPos = sn.map(d => ({ x: boxL.x + pad + (d.x - ex[0]) / ((ex[1] - ex[0]) || 1) * (boxL.w - 2 * pad), y: boxL.y + pad + 12 + (d.y - ey[0]) / ((ey[1] - ey[0]) || 1) * (boxL.h - 2 * pad - 12) }));
      d3.tree().size([boxR.w - 2 * pad, boxR.h - 2 * pad - 12])(tree);
      rNodes.forEach(d => { d.px = boxR.x + pad + d.x; d.py = boxR.y + pad + 12 + d.y; });
      build();
    }
    function build() {
      gL.selectAll('*').remove(); gR.selectAll('*').remove(); gT.selectAll('*').remove();
      gL.selectAll('line').data(links).join('line').attr('class', 'e');
      gL.selectAll('g.n').data(d3.range(N)).join('g').attr('class', 'n').style('cursor', 'pointer').on('click', (e, i) => run(i, null))
        .call(g => { g.append('circle').attr('class', 'ring').attr('fill', 'none'); g.append('circle').attr('class', 'c').attr('r', 8 * k).style('pointer-events', 'all'); });
      gR.selectAll('line').data(tree.links()).join('line').attr('class', 'e');
      gR.selectAll('g.n').data(rNodes).join('g').attr('class', 'n').style('cursor', 'pointer').on('click', (e, d) => run(null, d))
        .call(g => { g.append('circle').attr('class', 'ring').attr('fill', 'none'); g.append('circle').attr('class', 'c').attr('r', 8 * k).style('pointer-events', 'all');
          g.append('text').attr('text-anchor', 'middle').attr('y', 22 * k).style('font', '400 8px Jost').style('letter-spacing', '.12em').style('pointer-events', 'none').text(d => narrow && !d.children ? '' : d.data.name); });
      [[boxL, 'Without the harness', 'coupled files'], [boxR, 'With the harness', 'WHAT → HOW → CASE']].forEach(([b, t, s]) => {
        gT.append('text').attr('x', b.x + 2).attr('y', b.y - 14).attr('class', 'ttl').style('font', '400 10px Jost').style('letter-spacing', '.24em').style('text-transform', 'uppercase').text(narrow ? t : t + ' — ' + s);
      });
      ['L', 'R'].forEach((s, j) => { const b = j ? boxR : boxL;
        gT.append('text').attr('class', 'num ' + s).attr('x', b.x + 2).attr('y', b.y + b.h + 34).style('font', '300 38px "Cormorant Garamond", Georgia, serif');
        gT.append('text').attr('class', 'sub ' + s).attr('x', b.x + 2).attr('y', b.y + b.h + 52).style('font', '400 10px Jost').style('letter-spacing', '.18em').style('text-transform', 'uppercase').text('files touched');
      });
      place();
    }
    function place() {
      gL.selectAll('line').attr('x1', d => lPos[d[0]].x).attr('y1', d => lPos[d[0]].y).attr('x2', d => lPos[d[1]].x).attr('y2', d => lPos[d[1]].y);
      gL.selectAll('g.n').attr('transform', i => `translate(${lPos[i].x},${lPos[i].y})`);
      gR.selectAll('line').attr('x1', d => d.source.px).attr('y1', d => d.source.py).attr('x2', d => d.target.px).attr('y2', d => d.target.py);
      gR.selectAll('g.n').attr('transform', d => `translate(${d.px},${d.py})`);
    }

    function run(l, r) {
      if (clock < endAt && endAt !== Infinity && !still) { /* a run is in progress: restart it */ }
      const startL = l == null ? Math.floor(Math.random() * N) : l;
      const startR = r || leaves[Math.floor(Math.random() * leaves.length)];
      due = { L: {}, R: {} };
      const dist = { [startL]: 0 }, q = [startL];
      while (q.length) { const a = q.shift(); if (dist[a] >= 3) continue; adj[a].forEach(b => { if (dist[b] == null) { dist[b] = dist[a] + 1; q.push(b); } }); }
      Object.entries(dist).forEach(([id, d]) => { due.L[id] = clock + d * .45; });
      startR.each(d => { due.R[d.id] = clock + (d.depth - startR.depth) * .45; });
      endAt = clock + 5.5;
    }
    const age = (map, id) => (id in map) ? clock - map[id] : -1;

    function draw() {
      const hot = { L: T.bad, R: T.good };
      const style = (g, side, idOf) => {
        g.select('.c').attr('stroke', d => age(due[side], idOf(d)) >= 0 ? hot[side] : T.line).attr('fill', d => age(due[side], idOf(d)) >= 0 ? hot[side] : T.panel).attr('fill-opacity', d => { const a = age(due[side], idOf(d)); return a < 0 ? 1 : a < .5 ? 1 : .75; });
        g.select('.ring').attr('stroke', hot[side]).attr('r', d => { const a = age(due[side], idOf(d)); return 8 * k + Math.max(0, Math.min(1, a / .7)) * 22 * k; })
          .attr('stroke-opacity', d => { const a = age(due[side], idOf(d)); return a < 0 || a > .7 ? 0 : 1 - a / .7; });
      };
      style(gL.selectAll('g.n'), 'L', i => i); style(gR.selectAll('g.n'), 'R', d => d.id);
      const lit = (side, a, b) => age(due[side], a) >= 0 && age(due[side], b) >= 0;
      gL.selectAll('line').attr('stroke', d => lit('L', d[0], d[1]) ? T.bad : T.faint).attr('stroke-width', d => lit('L', d[0], d[1]) ? 1.6 : 1);
      gR.selectAll('line').attr('stroke', d => lit('R', d.source.id, d.target.id) ? T.good : T.faint).attr('stroke-width', d => lit('R', d.source.id, d.target.id) ? 1.6 : 1);
      gR.selectAll('text').attr('fill', T.mute); gT.selectAll('.ttl').attr('fill', T.gold); gT.selectAll('.sub').attr('fill', T.mute);
      const cnt = side => Object.keys(due[side]).filter(id => age(due[side], id) >= 0).length;
      gT.select('.num.L').attr('fill', T.bad).text(cnt('L') + ' / ' + N); gT.select('.num.R').attr('fill', T.good).text(cnt('R') + ' / ' + N);
      btn.style('color', T.gold).style('border-color', T.gold);
    }

    layout(); due = { L: {}, R: {} };
    if (still) { due = { L: {}, R: {} }; clock = 10; const s = leaves[4]; due.R[s.id] = 0; [0, 1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 3, 7].forEach(i => { due.L[i] = 0; }); }
    const ro = new ResizeObserver(() => { layout(); }); ro.observe(host);
    btn.on('click', () => { run(null, null); });
    let last = performance.now();
    const timer = d3.timer(now => {
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      if (!still) {
        clock += dt;
        if (clock >= endAt) { due = { L: {}, R: {} }; endAt = Infinity; nextRun = clock + 1.2; }
        if (endAt === Infinity && clock >= nextRun) run(null, null);
      }
      draw();
    });
    return { setTheme(t) { T = t; }, destroy() { timer.stop(); ro.disconnect(); root.selectAll('*').remove(); } };
  },
};
