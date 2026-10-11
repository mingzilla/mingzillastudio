// SearchWidget: live request stream UI -> Load Balancer -> API x n -> Cache -> Database.
//   const w = SearchWidget.draw(hostEl, { theme, reduceMotion }); w.setTheme(t); w.destroy();
// Each API serves one request at a time (~0.3 s). Cache hit = short path back; miss = go on to the DB.
// Add/kill pods and change traffic: watch the queues (red dots) and the latency histogram react.
const SearchWidget = {
  draw(host, opts = {}) {
    let T = opts.theme || WidgetTheme.dark;
    const still = !!opts.reduceMotion;
    const st = { pods: 4, rate: 12, served: 0, hits: 0, clock: 0 };
    const pods = []; let reqs = [], lat = [], nextId = 0, spawnIn = 0, W = 0, H = 0, FH = 0, narrow = false, k = 1;
    const HIT = .7;
    const addPod = () => pods.push({ alive: true, busy: null, queue: [], back: 0 });

    const root = d3.select(host).style('position', 'relative');
    const bar = root.append('div').style('display', 'flex').style('gap', '8px').style('flex-wrap', 'wrap').style('margin-bottom', '10px');
    const mk = (txt, fn) => bar.append('button').text(txt).on('click', fn).style('background', 'none').style('border', '1px solid').style('padding', '7px 12px')
      .style('font', '400 10px Jost, sans-serif').style('letter-spacing', '.2em').style('text-transform', 'uppercase').style('cursor', 'pointer');
    mk('− API', () => setPods(st.pods - 1)); mk('+ API', () => setPods(st.pods + 1));
    mk('− Traffic', () => { st.rate = Math.max(4, st.rate - 4); }); mk('+ Traffic', () => { st.rate = Math.min(40, st.rate + 4); });
    mk('Kill an API', () => kill());
    const svg = root.append('svg').style('display', 'block').style('width', '100%').attr('role', 'img').attr('aria-label', 'Search requests flowing through a load balancer, API pods, cache and database');
    const gLinks = svg.append('g'), gNodes = svg.append('g'), gReq = svg.append('g'), gHist = svg.append('g'), hud = svg.append('text').style('font', '400 11px Jost').style('letter-spacing', '.12em');
    for (let i = 0; i < st.pods; i++) addPod();

    const axis = i => { const L = narrow ? FH : W, pad = 50; return pad + i * (L - 2 * pad) / 4; };
    const pt = (a, c) => narrow ? { x: c, y: a } : { x: a, y: c };
    const cC = () => (narrow ? W : FH) / 2;
    const node = i => pt(axis(i), cC());
    const podPos = j => { const n = pods.length, gap = Math.min(40 * k, ((narrow ? W : FH) - 80) / Math.max(1, n)); return pt(axis(2), cC() + (j - (n - 1) / 2) * gap); };
    const lerp = (a, b, f) => ({ x: a.x + (b.x - a.x) * Math.min(1, f), y: a.y + (b.y - a.y) * Math.min(1, f) });

    function setPods(n) {
      n = Math.max(1, Math.min(8, n));
      while (pods.length < n) addPod();
      while (pods.length > n) { const p = pods.pop(); drain(p); }
      st.pods = pods.length; build();
    }
    function drain(p) { [p.busy, ...p.queue].filter(Boolean).forEach(r => { r.stage = 1; r.st = st.clock; r.pod = pickPod(); }); p.queue = []; p.busy = null; }
    function kill() {
      const alive = pods.filter(p => p.alive); if (alive.length < 2) return;
      const p = alive[Math.floor(Math.random() * alive.length)]; p.alive = false; p.back = st.clock + 4; drain(p);
    }
    const load = p => p.queue.length + (p.busy ? 1 : 0);
    const pickPod = () => { const a = pods.filter(p => p.alive); return a.reduce((m, p) => load(p) < load(m) ? p : m, a[0]); };

    function layout() {
      W = host.clientWidth || 640; narrow = W <= 560; k = narrow ? .95 : Math.max(.85, Math.min(1.1, W / 720));
      FH = narrow ? 420 : Math.round(W * .3); H = FH + 160; svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H); build();
    }
    function build() {
      gLinks.selectAll('*').remove(); gNodes.selectAll('*').remove();
      const names = ['UI', 'Load balancer', 'API × ' + pods.length, 'Cache', 'Database'];
      [0, 1, 3, 4].forEach(i => { const p = node(i);
        gNodes.append('rect').attr('class', 'nb').attr('x', p.x - 26 * k).attr('y', p.y - 16 * k).attr('width', 52 * k).attr('height', 32 * k).attr('rx', 3).attr('fill', 'none');
        gLinks.append('line').attr('class', 'lk').attr('x1', p.x).attr('y1', p.y).attr('x2', node(i === 1 ? 2 : i === 3 ? 4 : i + 1).x).attr('y2', node(i === 1 ? 2 : i === 3 ? 4 : i + 1).y);
      });
      names.forEach((n, i) => { const p = node(i);
        gNodes.append('text').attr('class', 'nt').attr('text-anchor', 'middle').attr('x', narrow ? p.x + (i === 2 ? 0 : 0) : p.x).attr('y', narrow ? p.y - 24 * k : i === 2 ? podPos(pods.length - 1).y + 30 * k : p.y - 28 * k)
          .style('font', '400 9px Jost').style('letter-spacing', '.14em').style('text-transform', 'uppercase').text(n); });
      pods.forEach((p, j) => { const q = podPos(j);
        gLinks.append('line').attr('class', 'lk').attr('x1', node(1).x).attr('y1', node(1).y).attr('x2', q.x).attr('y2', q.y);
        gLinks.append('line').attr('class', 'lk').attr('x1', q.x).attr('y1', q.y).attr('x2', node(3).x).attr('y2', node(3).y);
        gNodes.append('circle').attr('class', 'pod').datum(p).attr('cx', q.x).attr('cy', q.y).attr('r', 9 * k).attr('fill', 'none');
      });
      paint();
    }

    const exp = r => -Math.log(1 - Math.random()) / r;
    function spawn() { reqs.push({ id: nextId++, t0: st.clock, stage: 0, st: st.clock, hit: Math.random() < HIT, pod: null }); }
    function step(dt) {
      st.clock += dt; const c = st.clock;
      spawnIn -= dt; while (spawnIn <= 0) { if (reqs.length < 160) spawn(); spawnIn += exp(st.rate); }
      pods.forEach(p => { if (!p.alive && c >= p.back) p.alive = true; });
      reqs.forEach(r => {
        const e = c - r.st;
        if (r.stage === 0 && e >= .3) { r.stage = 1; r.st = c; r.pod = pickPod(); }
        else if (r.stage === 1 && e >= .3) { if (!r.pod.alive) r.pod = pickPod(); r.pod.queue.push(r); r.stage = 2; r.st = c; }
        else if (r.stage === 3 && e >= .2) { if (r.hit) { r.stage = 5; r.dur = .45; r.from = 3; } else { r.stage = 4; } r.st = c; }
        else if (r.stage === 4 && e >= .25) { r.stage = 4.5; r.st = c; }
        else if (r.stage === 4.5 && e >= .35) { r.stage = 5; r.dur = .6; r.from = 4; r.st = c; }
        else if (r.stage === 5 && e >= r.dur) { r.done = true; lat.push((c - r.t0) * 400); if (lat.length > 120) lat.shift(); st.served++; if (r.hit) st.hits++; }
      });
      pods.forEach(p => {
        if (p.busy && c >= p.busy.end) { const r = p.busy; p.busy = null; r.stage = 3; r.st = c; }
        if (p.alive && !p.busy && p.queue.length) { p.busy = p.queue.shift(); p.busy.end = c + .12 + Math.random() * .1; }
      });
      reqs = reqs.filter(r => !r.done);
    }
    function where(r) {
      const c = st.clock, e = c - r.st;
      switch (r.stage) {
        case 0: return lerp(node(0), node(1), e / .3);
        case 1: return lerp(node(1), podPos(pods.indexOf(r.pod)), e / .3);
        case 2: { const j = pods.indexOf(r.pod), q = podPos(j), i = r.pod.queue.indexOf(r); return i < 0 ? q : pt(axis(2) - (14 + i * 8) * k, (narrow ? q.x : q.y)); }
        case 3: return lerp(podPos(Math.max(0, pods.indexOf(r.pod))), node(3), e / .2);
        case 4: return lerp(node(3), node(4), e / .25);
        case 4.5: return node(4);
        default: return lerp(node(r.from), node(0), e / r.dur);
      }
    }
    const col = r => { const age = st.clock - r.t0; const base = r.stage === 5 ? (r.hit ? T.good : T.ink) : T.mute; return d3.interpolateRgb(base, T.bad)(Math.max(0, Math.min(1, (age - 1) / 1.5))); };
    const q = (a, p) => { const s = d3.sort(a); return s.length ? d3.quantile(s, p) : 0; };

    function paint() {
      gLinks.selectAll('.lk').attr('stroke', T.faint); gNodes.selectAll('.nb').attr('stroke', T.line); gNodes.selectAll('.nt').attr('fill', T.mute);
      bar.selectAll('button').style('color', T.gold).style('border-color', T.gold); hud.attr('fill', T.mute);
    }
    function draw() {
      gNodes.selectAll('.pod').attr('stroke', p => p.alive ? T.gold : T.bad).attr('stroke-dasharray', p => p.alive ? null : '2 3').attr('fill', p => p.busy ? T.gold : 'none').attr('fill-opacity', .35);
      const s = gReq.selectAll('circle').data(reqs, r => r.id);
      s.enter().append('circle').attr('r', 3.2 * k).merge(s).each(function (r) { const p = where(r); d3.select(this).attr('cx', p.x).attr('cy', p.y).attr('fill', col(r)); });
      s.exit().remove();
      const p50 = q(lat, .5), p95 = q(lat, .95);
      const a = `APIs ${pods.filter(p => p.alive).length}/${pods.length}  ·  traffic ${st.rate} req/s`, b = `p50 ${Math.round(p50)} ms  ·  p95 ${Math.round(p95)} ms  ·  cache hit ${st.served ? Math.round(st.hits / st.served * 100) : 0}%`;
      hud.attr('x', 4).attr('y', FH + 20).selectAll('tspan').data(narrow ? [a, b] : [a + '  ·  ' + b]).join('tspan').attr('x', 4).attr('dy', (d, i) => i ? 16 : 0).text(d => d);
      const x = d3.scaleLinear().domain([0, 2400]).range([4, W - 4]), bins = d3.bin().domain([0, 2400]).thresholds(d3.range(200, 2400, 200))(lat.map(v => Math.min(2399, v)));
      const y = d3.scaleLinear().domain([0, Math.max(5, d3.max(bins, b => b.length))]).range([0, 80]);
      gHist.selectAll('rect').data(bins).join('rect').attr('x', b => x(b.x0) + 1).attr('width', b => Math.max(1, x(b.x1) - x(b.x0) - 2)).attr('y', b => FH + 140 - y(b.length)).attr('height', b => y(b.length))
        .attr('fill', b => b.x0 >= 1200 ? T.bad : T.gold).attr('fill-opacity', .75);
      gHist.selectAll('text').data(['0', '1 s', '2 s +']).join('text').attr('x', (d, i) => [4, W / 2, W - 4][i]).attr('text-anchor', (d, i) => ['start', 'middle', 'end'][i]).attr('y', FH + 156)
        .style('font', '400 9px Jost').style('letter-spacing', '.14em').attr('fill', T.mute).text(d => d);
    }

    layout(); paint();
    if (still) { for (let i = 0; i < 60; i++) { step(.1); } }
    const ro = new ResizeObserver(layout); ro.observe(host);
    let last = performance.now();
    const timer = d3.timer(now => { const dt = Math.min(.1, (now - last) / 1000); last = now; if (!still) step(dt); draw(); });
    return { setTheme(t) { T = t; paint(); }, destroy() { timer.stop(); ro.disconnect(); root.selectAll('*').remove(); } };
  },
};
