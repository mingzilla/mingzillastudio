// PermissionsWidget: multi-level permissions in a multi-tenant BI platform. Pick a node in the access tree - the dashboard shows only what that level may see, and what it may do.
const PermissionsWidget = {
  draw(host, opts = {}) {
    const TREE = { name: 'Platform', lvl: 0, children: [
      { name: 'Tenant A', lvl: 1, children: [{ name: 'Sales', lvl: 2, children: [{ name: 'Manager', lvl: 3, mgr: 1 }, { name: 'Viewer', lvl: 3 }] }, { name: 'Ops', lvl: 2, children: [{ name: 'Viewer', lvl: 3 }] }] },
      { name: 'Tenant B', lvl: 1, children: [{ name: 'Finance', lvl: 2, children: [{ name: 'Manager', lvl: 3, mgr: 1 }, { name: 'Viewer', lvl: 3 }] }] }] };
    const LEVEL = ['Platform admin', 'Tenant admin', 'Group access', 'User'], CAN = [['view', 'edit', 'export', 'share', 'manage users'], ['view', 'edit', 'export', 'share'], ['view', 'edit', 'export'], ['view']];
    const TILES = [['A', 'Sales', 'Revenue'], ['A', 'Sales', 'Pipeline'], ['A', 'Ops', 'Tickets'], ['A', 'Ops', 'SLA'], ['B', 'Finance', 'Cash'], ['B', 'Finance', 'Budget'], ['B', 'Finance', 'Forecast'], ['A', 'Sales', 'Orders']];
    return WidgetKit.scene(host, opts, {
      aria: 'An access tree; choosing a level changes which dashboard tiles are visible and which actions are allowed', stillClock: 3, narrowAt: 560,
      height: s => s.narrow ? 640 : Math.round(s.W * .42),
      init(s) {
        s.h = d3.hierarchy(TREE); s.h.each((d, i) => { d.id = i; }); s.nodes = s.h.descendants(); s.sel = s.nodes.find(d => d.data.name === 'Manager'); s.nextSel = 3.5; s.i = 0;
        s.gT = s.svg.append('g'); s.gD = s.svg.append('g'); s.tx = s.svg.append('g');
      },
      layout(s) {
        s.tb = s.narrow ? { x: 0, y: 30, w: s.W, h: 230 } : { x: 0, y: 30, w: s.W * .42, h: s.H - 40 }; s.db = s.narrow ? { x: 0, y: 290, w: s.W, h: 330 } : { x: s.W * .46, y: 30, w: s.W * .54, h: s.H - 40 };
        d3.tree().size(s.narrow ? [s.tb.w - 60, s.tb.h - 40] : [s.tb.h - 40, s.tb.w - 130])(s.h);
        s.nodes.forEach(d => { d.px = s.narrow ? s.tb.x + 30 + d.x : s.tb.x + 20 + d.y; d.py = s.narrow ? s.tb.y + 14 + d.y : s.tb.y + 20 + d.x; });
        s.gT.selectAll('*').remove();
        s.gT.selectAll('line').data(s.h.links()).join('line').attr('class', 'tl').attr('x1', l => l.source.px).attr('y1', l => l.source.py).attr('x2', l => l.target.px).attr('y2', l => l.target.py);
        const n = s.gT.selectAll('g.n').data(s.nodes).join('g').attr('class', 'n').attr('transform', d => `translate(${d.px},${d.py})`).style('cursor', 'pointer').on('click', (e, d) => { s.sel = d; s.nextSel = s.clock + 9; });
        n.append('circle').attr('r', d => (9 - d.data.lvl * 1.4) * s.k).style('pointer-events', 'all');
        n.append('text').attr('class', 'nm').attr('x', 0).attr('y', d => (s.narrow ? -((9 - d.data.lvl * 1.4) * s.k + 7) : 0)).attr('dx', d => s.narrow ? 0 : (9 - d.data.lvl * 1.4) * s.k + 8).attr('dominant-baseline', s.narrow ? 'auto' : 'middle').attr('text-anchor', s.narrow ? 'middle' : 'start').style('font', '400 10px Jost').style('letter-spacing', '.1em').text(d => s.narrow && d.data.lvl === 3 ? (d.data.mgr ? 'Mgr' : 'View') : d.data.name);
      },
      frame(s, dt) {
        const T = s.T, k = s.k, sel = s.sel, a = sel.ancestors().map(d => d.data.name);
        if (!s.still && s.clock > s.nextSel) { s.i = (s.i + 1) % s.nodes.length; s.sel = s.nodes[s.i]; s.nextSel = s.clock + 3.2; }
        const lvl = s.sel.data.lvl, tenant = a.find(n => n.startsWith('Tenant')), group = s.sel.ancestors().find(d => d.data.lvl === 2), gname = group && group.data.name;
        const can = tile => lvl === 0 || (lvl === 1 && tile[0] === tenant.slice(-1)) || (lvl >= 2 && tile[1] === gname);
        s.gT.selectAll('.tl').attr('stroke', T.line);
        s.gT.selectAll('g.n circle').attr('stroke', T.gold).attr('fill', d => d === s.sel ? T.gold : 'none').attr('fill-opacity', .8);
        s.gT.selectAll('g.n text').attr('fill', d => d === s.sel ? T.ink : T.mute);
        const db = s.db, cols = s.narrow ? 2 : 4, tw = (db.w - 8 * (cols - 1)) / cols, th = (s.narrow ? 54 : 62) * k;
        const d = s.gD.selectAll('g.t').data(TILES, t => t[2]).join(e => { const g = e.append('g').attr('class', 't'); g.append('rect'); g.append('text').attr('class', 'a'); g.append('text').attr('class', 'b'); g.append('g').attr('class', 'bars'); return g; });
        d.attr('transform', (t, i) => `translate(${db.x + (i % cols) * (tw + 8)},${db.y + 50 + Math.floor(i / cols) * (th + 8)})`);
        d.select('rect').attr('width', tw).attr('height', th).attr('fill', 'none').attr('stroke', t => can(t) ? T.gold : T.line).attr('stroke-opacity', t => can(t) ? 1 : .5).attr('stroke-dasharray', t => can(t) ? null : '3 3');
        d.select('.a').attr('x', 8).attr('y', 17).attr('fill', t => can(t) ? T.ink : T.mute).style('font', '400 10px Jost').style('letter-spacing', '.14em').text(t => can(t) ? t[2].toUpperCase() : 'NO ACCESS');
        d.select('.b').attr('x', 8).attr('y', th - 8).attr('fill', T.mute).style('font', '400 8.5px Jost').style('letter-spacing', '.1em').text(t => can(t) ? `${t[0] === 'A' ? 'Tenant A' : 'Tenant B'} · ${t[1]}` : '');
        d.select('.bars').attr('transform', `translate(${tw - 54},${th - 12})`).selectAll('rect').data((t, ti) => d3.range(5).map(j => [(ti * 7 + j * 3) % 5 + 1, can(t)])).join('rect')
          .attr('x', (z, j) => j * 10).attr('width', 7).attr('y', z => -z[0] * 5).attr('height', z => z[0] * 5).attr('fill', T.gold).attr('fill-opacity', z => z[1] ? .75 : 0);
        s.tx.selectAll('*').remove();
        WidgetKit.text(s.tx.append('text'), 10, '.22em').attr('x', 2).attr('y', 18).attr('fill', T.gold).text('ACCESS TREE');
        const who = `${s.sel.ancestors().reverse().slice(1).map(d => d.data.name).join(' / ') || 'Platform'} · ${LEVEL[lvl]}`;
        WidgetKit.text(s.tx.append('text'), 10, '.22em').attr('x', db.x + 2).attr('y', s.narrow ? db.y - 8 : 18).attr('fill', T.gold).text((s.narrow ? 'AS: ' : 'DASHBOARD AS: ') + who.toUpperCase());
        const caps = lvl === 3 && s.sel.data.mgr ? CAN[2] : CAN[lvl]; let cx = db.x + 2;
        caps.forEach(c => { const w = c.length * 6.4 + 16; s.tx.append('rect').attr('x', cx).attr('y', db.y + 14).attr('width', w).attr('height', 20).attr('fill', 'none').attr('stroke', T.gold).attr('stroke-opacity', .7);
          WidgetKit.text(s.tx.append('text'), 9, '.12em').attr('x', cx + 8).attr('y', db.y + 28).attr('fill', T.ink).text(c.toUpperCase()); cx += w + 6; });
      },
    });
  },
};
