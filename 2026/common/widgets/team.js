// TeamWidget: "night shift" for the Co-work Agent Team. Framework-free.
//   const w = TeamWidget.draw(hostEl, { theme, reduceMotion }); w.setTheme(t); w.destroy();
// Tickets flow Ticket -> Proposal -> Implement -> Review -> Document. The reviewer bounces bad ones
// (only while Rules & Hooks are on). The worker's context fills and hands over to a fresh worker.
const TeamWidget = {
  draw(host, opts = {}) {
    let T = opts.theme || WidgetTheme.dark;
    const still = !!opts.reduceMotion;
    const STATIONS = ['Ticket', 'Proposal', 'Implement', 'Review', 'Document'];
    const AGENTS = [{ name: 'Researcher', at: 1 }, { name: 'Worker', at: 2 }, { name: 'Reviewer', at: 3 }];
    const st = { rules: true, speed: 1, done: 0, bounced: 0, bugs: 0, handovers: 0, ctx: 0, flash: 0, alarm: 0, night: 0 };
    let tickets = [], nextId = 0, spawnIn = 0, clock = 0, W = 0, H = 0, narrow = false, k = 1;

    const root = d3.select(host).style('position', 'relative');
    const bar = root.append('div').style('display', 'flex').style('gap', '10px').style('flex-wrap', 'wrap').style('margin-bottom', '10px');
    const mkBtn = (txt, fn) => bar.append('button').text(txt).on('click', fn)
      .style('background', 'none').style('border', '1px solid').style('padding', '7px 14px')
      .style('font', '400 10px Jost, sans-serif').style('letter-spacing', '.22em').style('text-transform', 'uppercase').style('cursor', 'pointer');
    const bRules = mkBtn('', () => { st.rules = !st.rules; label(); });
    const bSpeed = mkBtn('', () => { st.speed = st.speed === 1 ? 2 : st.speed === 2 ? 4 : 1; label(); });
    const svg = root.append('svg').style('display', 'block').style('width', '100%').attr('role', 'img')
      .attr('aria-label', 'Agent team working through tickets overnight');
    const sky = svg.append('rect').attr('x', 0).attr('y', 0);
    const stars = svg.append('g'), moon = svg.append('path').attr('d', 'M0,-9 A9,9 0 1 0 0,9 A12,12 0 0 1 0,-9');
    const rnd = d3.randomLcg(11), starData = d3.range(36).map(() => ({ x: rnd(), y: rnd() * .8, r: .6 + rnd() * 1.2, p: rnd() * 6 }));
    const lines = svg.append('g'), stationG = svg.append('g'), agentG = svg.append('g'), ticketG = svg.append('g');
    const hud = svg.append('text').attr('class', 'hud').style('font', '400 11px Jost, sans-serif').style('letter-spacing', '.14em');
    const mood = svg.append('text').style('font', '400 10px Jost, sans-serif').style('letter-spacing', '.26em').style('text-transform', 'uppercase');
    const sup = svg.append('g');
    sup.append('circle').attr('class', 'sc').attr('fill', 'none');
    sup.append('text').attr('text-anchor', 'middle').attr('y', 4).style('font', '400 9px Jost').style('letter-spacing', '.14em').text('SUPERVISOR');

    function label() {
      bRules.text('Rules & hooks: ' + (st.rules ? 'on' : 'off'));
      bSpeed.text('Speed ' + st.speed + '×');
    }

    function layout() {
      W = host.clientWidth || 640; narrow = W <= 560; k = narrow ? .95 : Math.max(.8, Math.min(1.1, W / 720));
      H = narrow ? 520 : Math.round(W * .42);
      svg.attr('viewBox', `0 0 ${W} ${H}`).attr('height', H);
      sky.attr('width', W).attr('height', H);
    }
    const pos = i => narrow ? { x: W * .62, y: 80 + i * (H - 170) / 4 } : { x: 56 + i * (W - 112) / 4, y: H * .66 };
    const agentPos = a => { const p = pos(a.at); return narrow ? { x: W * .2, y: p.y } : { x: p.x, y: p.y - H * .3 }; };
    const supPos = () => narrow ? { x: W * .86, y: H * .1 } : { x: W / 2, y: H * .1 };
    const along = s => { const i = Math.max(0, Math.min(3.999, Math.floor(s))), a = pos(i), b = pos(i + 1), f = Math.min(1, s - i); return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f }; };

    function build() {
      stationG.selectAll('*').remove(); agentG.selectAll('*').remove(); lines.selectAll('*').remove();
      STATIONS.forEach((n, i) => {
        const p = pos(i), g = stationG.append('g').attr('transform', `translate(${p.x},${p.y})`);
        g.append('circle').attr('r', 5 * k).attr('class', 'sr').attr('fill', 'none');
        g.append('text').attr('class', 'sl').attr('text-anchor', narrow ? 'start' : 'middle').attr('dominant-baseline', 'middle')
          .attr('x', narrow ? 14 : 0).attr('y', narrow ? 0 : 22 * k).style('font', '400 9px Jost').style('letter-spacing', '.12em').style('text-transform', 'uppercase').text(n);
        if (i < 4) { const q = pos(i + 1); lines.append('line').attr('class', 'tl').attr('x1', p.x).attr('y1', p.y).attr('x2', q.x).attr('y2', q.y); }
      });
      const s = supPos();
      AGENTS.forEach(a => {
        const p = agentPos(a), g = agentG.append('g').attr('class', 'ag').datum(a).attr('transform', `translate(${p.x},${p.y})`);
        g.append('circle').attr('class', 'ac').attr('r', 17 * k).attr('fill', 'none');
        g.append('circle').attr('class', 'ah').attr('cy', -4 * k).attr('r', 4.5 * k);
        g.append('path').attr('class', 'as').attr('d', `M${-8 * k},${9 * k} Q0,${-2 * k} ${8 * k},${9 * k}`).attr('fill', 'none');
        if (a.name === 'Worker') g.append('path').attr('class', 'gauge');
        g.append('text').attr('text-anchor', 'middle').attr('y', 32 * k).style('font', '400 9px Jost').style('letter-spacing', '.14em').attr('class', 'an').text(a.name.toUpperCase());
        lines.append('line').attr('class', 'wl').attr('x1', s.x).attr('y1', s.y).attr('x2', p.x).attr('y2', p.y);
      });
      sup.attr('transform', `translate(${s.x},${s.y})`);
      sup.select('.sc').attr('r', 22 * k);
      hud.attr('x', 12).attr('y', narrow ? H - 28 : H - 12); mood.attr('x', 12).attr('y', 20);
    }
    function paint() {
      sky.attr('fill', T.night);
      bar.selectAll('button').style('color', T.gold).style('border-color', T.gold);
      lines.selectAll('.tl').attr('stroke', T.line).attr('stroke-width', 1);
      lines.selectAll('.wl').attr('stroke', T.faint).attr('stroke-dasharray', '2 4');
      stationG.selectAll('.sr').attr('stroke', T.line); stationG.selectAll('.sl').attr('fill', T.mute);
      agentG.selectAll('.ac').attr('stroke', T.gold); agentG.selectAll('.ah').attr('fill', T.gold); agentG.selectAll('.as').attr('stroke', T.gold).attr('stroke-width', 1.5); agentG.selectAll('.an').attr('fill', T.mute);
      agentG.selectAll('.gauge').attr('fill', T.gold).attr('fill-opacity', .55);
      sup.select('.sc').attr('stroke', T.ink); sup.select('text').attr('fill', T.mute);
      hud.attr('fill', T.mute); mood.attr('fill', T.gold);
    }
    const arc = d3.arc().innerRadius(21).outerRadius(24).startAngle(0);

    function step(dt) {
      clock += dt;
      st.night += ((Math.floor(clock / 18) % 2 ? 1 : 0) - st.night) * Math.min(1, dt * 1.5);
      st.flash = Math.max(0, st.flash - dt); st.alarm = Math.max(0, st.alarm - dt);
      spawnIn -= dt;
      if (spawnIn <= 0 && tickets.filter(t => !t.fade).length < 6) { tickets.push({ id: nextId++, s: 0, dir: 1, bad: Math.random() < .3, hold: 0, reviewed: false, impl: false, ship: false, fade: 0 }); spawnIn = 1.3; }
      tickets.forEach(t => {
        if (t.fade) { t.fade += dt * 2; return; }
        if (t.hold > 0) { t.hold -= dt; return; }
        t.s += t.dir * dt * .8;
        if (t.dir === 1 && t.s >= 2 && !t.impl) { t.impl = true; st.ctx += .17; if (st.ctx >= 1) { st.ctx = 0; st.handovers++; st.flash = 1.2; t.hold = 1.2; } }
        if (t.dir === 1 && t.s >= 3 && !t.reviewed) {
          t.reviewed = true;
          if (t.bad && st.rules) { t.dir = -1; st.bounced++; st.alarm = 1; } else if (t.bad) t.ship = true;
        }
        if (t.dir === -1 && t.s <= 2) { t.s = 2; t.dir = 1; t.bad = false; t.hold = .5; t.reviewed = false; }
        if (t.s >= 4) { t.s = 4; t.fade = .01; st.done++; if (t.ship) st.bugs++; }
      });
      tickets = tickets.filter(t => t.fade < 1);
    }
    function draw() {
      const r = 7 * k;
      const sel = ticketG.selectAll('circle').data(tickets, t => t.id);
      sel.enter().append('circle').merge(sel)
        .attr('r', t => r * (1 - t.fade * .6)).attr('cx', t => along(t.s).x).attr('cy', t => along(t.s).y)
        .attr('fill', t => t.bad || t.ship ? T.bad : T.good).attr('fill-opacity', t => (1 - t.fade) * .9)
        .attr('stroke', T.ink).attr('stroke-width', t => t.hold > 0 ? 1.5 : 0);
      sel.exit().remove();
      sky.attr('opacity', st.night * .9);
      stars.selectAll('circle').data(starData).join('circle').attr('cx', d => d.x * W).attr('cy', d => d.y * H).attr('r', d => d.r).attr('fill', T.ink)
        .attr('opacity', d => st.night * (.35 + .35 * Math.sin(clock * 1.5 + d.p)));
      moon.attr('transform', `translate(${W - 28},${26})`).attr('fill', T.gold).attr('opacity', st.night);
      mood.text(st.night > .5 ? 'You are asleep' : 'You are awake');
      hud.selectAll('tspan').data(narrow ? [`done ${st.done}  ·  bounced ${st.bounced}`, `bugs shipped ${st.bugs}  ·  handovers ${st.handovers}`] : [`done ${st.done}   ·   bounced ${st.bounced}   ·   bugs shipped ${st.bugs}   ·   handovers ${st.handovers}`])
        .join('tspan').attr('x', 12).attr('dy', (d, i) => i ? 16 : 0).text(d => d);
      agentG.selectAll('.gauge').attr('d', arc.endAngle(st.ctx * Math.PI * 2)());
      agentG.selectAll('.ac').attr('stroke-width', function (a) { return (a.name === 'Worker' && st.flash > 0) || (a.name === 'Reviewer' && st.alarm > 0) ? 2.5 : 1; });
      sup.select('.sc').attr('stroke-opacity', .5 + .5 * Math.sin(clock * 2));
      hud.attr('fill', st.bugs ? T.bad : T.mute);
    }

    layout(); label(); build(); paint();
    const ro = new ResizeObserver(() => { layout(); build(); paint(); }); ro.observe(host);
    let last = 0;   // d3.timer passes ms elapsed since the timer started
    const timer = d3.timer(now => {
      const dt = Math.min(.1, (now - last) / 1000) * st.speed; last = now;
      if (still) { if (!tickets.length) { for (let i = 0; i < 5; i++) tickets.push({ id: nextId++, s: i * .8, dir: 1, bad: i === 3, hold: 0, reviewed: true, impl: true, ship: false, fade: 0 }); st.done = 4; st.bounced = 1; } }
      else step(dt);
      draw();
    });
    return { setTheme(t) { T = t; paint(); }, destroy() { timer.stop(); ro.disconnect(); root.selectAll('*').remove(); } };
  },
};
