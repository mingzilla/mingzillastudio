// WidgetKit.scene: the boilerplate every widget shares - svg, buttons, resize, timer, theme, still frame.
// cfg: { aria, narrowAt?, height(s), buttons?: [[key, label, fn(s)]], stillClock?, init(s), layout(s), frame(s, dt), paint(s) }
// s: { T, W, H, narrow, k, clock, still, root, bar, svg, btn, label(key, text) }   Widgets keep their own state on s.
const WidgetKit = {
  scene(host, opts, cfg) {
    const s = { T: opts.theme, still: !!opts.reduceMotion, clock: 0, W: 0, H: 0, narrow: false, k: 1, speed: 1, root: d3.select(host).style('position', 'relative'), btn: {} };
    s.bar = s.root.append('div').style('display', cfg.buttons ? 'flex' : 'none').style('gap', '8px').style('flex-wrap', 'wrap').style('margin-bottom', '10px');
    (cfg.buttons || []).forEach(([key, label, fn]) => {
      s.btn[key] = s.bar.append('button').text(label).on('click', () => fn(s)).style('background', 'none').style('border', '1px solid').style('padding', '7px 14px')
        .style('font', '400 10px Jost, sans-serif').style('letter-spacing', '.2em').style('text-transform', 'uppercase').style('cursor', 'pointer');
    });
    s.label = (key, text) => s.btn[key].text(text);
    const sp = new URLSearchParams(location.search).get('speed'); if (sp) s.speed = +sp;   // dev: ?speed=4 fast-forwards every widget
    s.svg = s.root.append('svg').style('display', 'block').style('width', '100%').attr('role', 'img').attr('aria-label', cfg.aria);
    const paint = () => { s.bar.selectAll('button').style('color', s.T.gold).style('border-color', s.T.gold); if (cfg.paint) cfg.paint(s); };
    const layout = () => {
      s.W = host.clientWidth || 640; s.narrow = s.W <= (cfg.narrowAt || 560); s.k = s.narrow ? .95 : Math.max(.85, Math.min(1.1, s.W / 720));
      s.H = cfg.height(s); s.svg.attr('viewBox', `0 0 ${s.W} ${s.H}`).attr('height', s.H);
      if (cfg.layout) cfg.layout(s); paint();
    };
    cfg.init(s); if (s.still && cfg.stillClock) s.clock = cfg.stillClock;
    layout();
    const ro = new ResizeObserver(layout); ro.observe(host);
    let last = 0;   // d3.timer passes ms elapsed since the timer started
    const timer = d3.timer(now => { const dt = Math.min(.1 * s.speed, (now - last) / 1000 * s.speed); last = now; if (!s.still) s.clock += dt; cfg.frame(s, s.still ? 0 : dt); });
    return { state: s, setTheme(t) { s.T = t; paint(); }, destroy() { timer.stop(); ro.disconnect(); s.root.selectAll('*').remove(); } };
  },
  text(g, size, ls = '.14em') { return g.style('font', `400 ${size}px Jost, sans-serif`).style('letter-spacing', ls); },
  serif(g, size) { return g.style('font', `300 ${size}px "Cormorant Garamond", Georgia, serif`); },
};
