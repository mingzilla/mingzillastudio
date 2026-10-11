// VectorsWidget: 10M+ rows, sampled to a few thousand points. Click a point (or wait): its nearest neighbours light up. Drag to pan; +/- to zoom.
const VectorsWidget = {
  draw(host, opts = {}) {
    const NP = 700, NP_NARROW = 380, K = 10;   // a sample, not the 10M: a few hundred dots is a cloud; thousands only cost a phone frames
    return WidgetKit.scene(host, opts, {
      aria: 'A star field of sampled vectors; a query point finds its nearest neighbours', stillClock: 3, narrowAt: 520,
      height: s => s.narrow ? 380 : Math.round(s.W * .42),
      buttons: [['zin', '+ Zoom', s => zoom(s, 1.6)], ['zout', '− Zoom', s => zoom(s, 1 / 1.6)], ['q', 'New query', s => query(s, null)]],
      init(s) {
        const rnd = d3.randomLcg(31), gauss = d3.randomNormal.source(d3.randomLcg(32))(0, 1);
        const cen = d3.range(9).map(() => [.08 + rnd() * .84, .1 + rnd() * .8, .035 + rnd() * .05]);
        s.all = d3.range(NP).map(i => { const c = cen[i % cen.length]; return { x: c[0] + gauss() * c[2], y: c[1] + gauss() * c[2] * .8, c: i % cen.length }; });
        s.cv = s.root.append('canvas').style('display', 'block').style('width', '100%').style('touch-action', 'pan-y').node(); s.ctx = s.cv.getContext('2d'); s.svg.remove();
        s.tf = d3.zoomIdentity; s.q = null; s.nb = []; s.qAt = -9; s.nextQ = 1.5;
        s.zoomB = d3.zoom().scaleExtent([1, 12]).filter(e => (e.type === 'wheel' ? e.ctrlKey : e.pointerType !== 'touch' && e.type !== 'dblclick') || (e.touches && e.touches.length > 1)).on('zoom', e => { s.tf = e.transform; });
        d3.select(s.cv).call(s.zoomB).on('click', e => { const [px, py] = d3.pointer(e); query(s, nearest(s, px, py)); });
      },
      layout(s) { s.pts = s.narrow ? s.all.slice(0, NP_NARROW) : s.all; if (s.q != null && s.q >= s.pts.length) s.q = null; s.dpr = Math.min(2, window.devicePixelRatio || 1); s.cv.width = s.W * s.dpr; s.cv.height = s.H * s.dpr; s.cv.style.height = s.H + 'px'; s.ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0); s.sx = d3.scaleLinear().domain([-.05, 1.05]).range([10, s.W - 10]); s.sy = d3.scaleLinear().domain([-.05, 1.05]).range([46, s.H - 30]); },
      frame(s, dt) {
        const T = s.T, c = s.ctx, t = s.clock; c.clearRect(0, 0, s.W, s.H);
        if (!s.still && t > s.nextQ) { query(s, null); s.nextQ = t + 4; }
        if (s.still && s.q == null) query(s, 123);
        const px = p => s.tf.applyX(s.sx(p.x)), py = p => s.tf.applyY(s.sy(p.y));
        c.fillStyle = T.ink; c.globalAlpha = .6; const d = s.narrow ? 3.4 : 2.8; s.pts.forEach(p => { const x = px(p), y = py(p); if (x > -3 && x < s.W + 3 && y > -3 && y < s.H + 3) c.fillRect(x - d / 2, y - d / 2, d, d); }); c.globalAlpha = 1;
        const age = t - s.qAt;
        if (s.q != null) { const q = s.pts[s.q], x = px(q), y = py(q);
          c.strokeStyle = T.gold; c.lineWidth = 1; s.nb.forEach((i, j) => { const n = s.pts[i], a = Math.max(0, Math.min(1, (age - j * .05) / .3)); c.globalAlpha = a * .8; c.beginPath(); c.moveTo(x, y); c.lineTo(px(n), py(n)); c.stroke(); c.fillStyle = T.gold; c.beginPath(); c.arc(px(n), py(n), 4, 0, 7); c.fill(); });
          c.globalAlpha = Math.max(0, 1 - (age % 1.6) / 1.6); c.beginPath(); c.arc(x, y, 6 + (age % 1.6) * 40, 0, 7); c.stroke(); c.globalAlpha = 1; c.fillStyle = T.ink; c.beginPath(); c.arc(x, y, 4.5, 0, 7); c.fill(); }
        c.fillStyle = T.gold; c.font = '400 10px Jost, sans-serif'; c.fillText('10M+ ROWS  ·  >50 GB  ·  A SAMPLE OF ' + s.pts.length + ' POINTS', 4, 18);
        c.fillStyle = T.mute; c.font = '400 11px Jost, sans-serif'; c.fillText(s.q ? `query → ${K} nearest neighbours · creation speed and query speed are what the vdb choice decides` : 'click a point to query', 4, 36);
        s.btn.zin && s.bar.style('display', 'flex');
      },
    });
    function nearest(s, mx, my) { let b = 0, bd = 1e9; s.pts.forEach((p, i) => { const d = (s.tf.applyX(s.sx(p.x)) - mx) ** 2 + (s.tf.applyY(s.sy(p.y)) - my) ** 2; if (d < bd) { bd = d; b = i; } }); return b; }
    function query(s, i) { s.q = i == null ? Math.floor(Math.random() * s.pts.length) : i; const q = s.pts[s.q]; if (!s.still && s.cv) { const x = s.sx(q.x), y = s.sy(q.y); d3.select(s.cv).transition().duration(900).call(s.zoomB.transform, d3.zoomIdentity.translate(s.W / 2 - x * 2.8, s.H / 2 - y * 2.8).scale(2.8)); clearTimeout(s.back); s.back = setTimeout(() => s.cv && d3.select(s.cv).transition().duration(800).call(s.zoomB.transform, d3.zoomIdentity), 2800); } s.nb = d3.range(s.pts.length).filter(j => j !== s.q).map(j => [j, (s.pts[j].x - q.x) ** 2 + (s.pts[j].y - q.y) ** 2]).sort((a, b) => a[1] - b[1]).slice(0, K).map(a => a[0]); s.qAt = s.clock; }
    function zoom(s, f) { d3.select(s.cv).transition().duration(250).call(s.zoomB.scaleBy, f, [s.W / 2, s.H / 2]); }
  },
};
