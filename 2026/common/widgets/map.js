// MapWidget: the hero "map". Framework-free.
//   const w = MapWidget.draw(hostEl, { nodes }, { theme, onSelect, reduceMotion });
//   w.setTheme(theme); w.destroy();
// node: { id, kind: 'me'|'cluster'|'app', label, figure?, challenge?, weight, ax, ay, mx?, my? }  (ax/ay = anchor 0..1; mx/my = anchor when narrow)
const MapWidget = {
  themes: {
    dark: { fill: 'none', stroke: '#c8a96a88', appFill: '#c8a96a14', appStroke: '#c8a96a', meStroke: '#e9e2d3', text: '#8f877a', appText: '#c8a96a', meText: '#e9e2d3', link: '#c8a96a33', hover: '#c8a96a', tipBg: '#14120f', tipText: '#e9e2d3', tipMute: '#c8a96a' },
    light: { fill: 'none', stroke: '#8c6a2c88', appFill: '#8c6a2c14', appStroke: '#8c6a2c', meStroke: '#1a1712', meText: '#1a1712', text: '#6f675a', appText: '#8c6a2c', link: '#8c6a2c33', hover: '#8c6a2c', tipBg: '#f3eee3', tipText: '#1a1712', tipMute: '#8c6a2c' },
  },

  draw(host, data, opts = {}) {
    let theme = opts.theme || MapWidget.themes.dark;
    const still = !!opts.reduceMotion;
    const nodes = data.nodes.map((n, i) => ({ ...n, i, x: 0, y: 0, vx: 0, vy: 0, phase: i * 1.7, born: 0 }));
    const me = nodes.find(n => n.kind === 'me');

    const root = d3.select(host).style('position', 'relative');
    const svg = root.append('svg').style('display', 'block').style('width', '100%').attr('role', 'img').attr('aria-label', 'Map of work: harness, files, websites, automation, search, Simzilla, Upskill');
    const linkLayer = svg.append('g');
    const nodeLayer = svg.append('g');
    const tip = root.append('div').style('position', 'absolute').style('pointer-events', 'none').style('opacity', 0)
      .style('max-width', '240px').style('padding', '12px 14px').style('font', '300 13px/1.45 Jost, system-ui, sans-serif')
      .style('border', '1px solid ' + theme.hover).style('transition', 'opacity .15s');

    let W = 0, H = 0, k = 1, hovered = null, pointer = null;
    const radius = n => (n.kind === 'me' ? 28 : 18 + n.weight * 46) * k;

    const links = linkLayer.selectAll('line').data(nodes.filter(n => n !== me)).join('line').attr('stroke-width', 1);
    const g = nodeLayer.selectAll('g').data(nodes).join('g').style('cursor', n => n.kind === 'me' ? 'default' : 'pointer');
    g.append('circle').attr('class', 'c').attr('stroke-width', 1).style('pointer-events', 'all');
    g.append('text').attr('class', 'l').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .style('font', '400 10px Jost, system-ui, sans-serif').style('letter-spacing', '.14em').style('text-transform', 'uppercase').style('pointer-events', 'none');
    g.append('text').attr('class', 'f').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .style('font', '400 15px "Cormorant Garamond", Georgia, serif').style('pointer-events', 'none');

    g.on('pointerenter', (e, n) => { if (n.kind !== 'me') { hovered = n; showTip(n); } })
      .on('pointerleave', () => { hovered = null; tip.style('opacity', 0); })
      .on('click', (e, n) => { if (n.kind !== 'me' && opts.onSelect) opts.onSelect(n); });
    svg.on('pointermove', e => { const [x, y] = d3.pointer(e); pointer = { x, y }; })
       .on('pointerleave', () => { pointer = null; });

    function showTip(n) {
      tip.html(`<div style="font:400 10px Jost;letter-spacing:.24em;text-transform:uppercase;color:${theme.tipMute};margin-bottom:6px">${n.label}${n.figure ? ' · ' + n.figure : ''}</div>${n.challenge || ''}`)
        .style('background', theme.tipBg).style('color', theme.tipText).style('border-color', theme.hover);
      const tw = 240, left = Math.max(8, Math.min(W - tw - 8, n.x - tw / 2));
      const below = n.y < H / 2;
      tip.style('left', left + 'px').style('top', (below ? n.y + radius(n) + 10 : Math.max(8, n.y - radius(n) - 100)) + 'px').style('opacity', 1);
    }

    function layout() {
      W = host.clientWidth || 600; k = Math.max(.9, Math.min(1.15, W / 640));
      const narrow = W <= 460;
      H = Math.round(W * (narrow ? 1.35 : .78));
      svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H);
      nodes.forEach(n => { n.bx = (narrow && n.mx != null ? n.mx : n.ax) * W; n.by = (narrow && n.my != null ? n.my : n.ay) * H; if (!n.x) { n.x = W / 2; n.y = H / 2; } });
    }
    function paint(theme) {
      links.attr('stroke', theme.link);
      g.select('.c').attr('fill', n => n.kind === 'app' ? theme.appFill : theme.fill)
        .attr('stroke', n => n.kind === 'me' ? theme.meStroke : n.kind === 'app' ? theme.appStroke : theme.stroke);
      g.select('.l').attr('fill', n => n.kind === 'me' ? theme.meText : n.kind === 'app' ? theme.appText : theme.text);
      g.select('.f').attr('fill', theme.appText);
    }
    layout(); paint(theme);

    const ro = new ResizeObserver(() => { layout(); }); ro.observe(host);
    const t0 = performance.now();
    const timer = d3.timer(now => {
      const t = (now - t0) / 1000;
      nodes.forEach(n => {
        const grow = still ? 1 : d3.easeCubicOut(Math.max(0, Math.min(1, (t - n.i * .08) / .8)));
        const drift = still ? 0 : 5 * k;
        let tx = n.bx + Math.sin(t * .6 + n.phase) * drift, ty = n.by + Math.cos(t * .5 + n.phase) * drift;
        if (n === me) { tx = n.bx; ty = n.by; }
        if (pointer && !still && n !== me) { tx += (W / 2 - pointer.x) / W * 14 * k; ty += (H / 2 - pointer.y) / H * 14 * k; }
        n.vx = (n.vx + (tx - n.x) * .06) * .82; n.vy = (n.vy + (ty - n.y) * .06) * .82;
        n.x += n.vx; n.y += n.vy;
        n.r = radius(n) * grow * (n === hovered ? 1.08 : 1) * (still ? 1 : 1 + Math.sin(t * 1.2 + n.phase) * .012);
      });
      links.attr('x1', me.x).attr('y1', me.y).attr('x2', n => n.x).attr('y2', n => n.y).style('opacity', n => Math.min(1, n.r / radius(n)));
      g.attr('transform', n => `translate(${n.x},${n.y})`);
      g.select('.c').attr('r', n => Math.max(0, n.r)).attr('stroke-width', n => n === hovered ? 1.6 : 1);
      g.select('.l').style('font-size', n => Math.max(8, Math.min(10, (radius(n) * 1.65) / (n.label.length * .95))) + 'px').attr('y', n => n.figure ? -6 : 0).style('opacity', n => Math.min(1, n.r / radius(n))).text(n => n.label);
      g.select('.f').attr('y', 11).style('opacity', n => Math.min(1, n.r / radius(n))).text(n => n.figure || '');
      if (hovered) showTip(hovered);
    });

    return {
      setTheme(th) { theme = th; paint(th); },
      destroy() { timer.stop(); ro.disconnect(); root.selectAll('*').remove(); },
    };
  },
};
