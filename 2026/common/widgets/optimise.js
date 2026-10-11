// OptimiseWidget: one skill as a ribbon of blocks. Diagnose (wasteful tool calls, cache breakers) -> clean (structure, length, violations) -> move deterministic work from the LLM to code.
const OptimiseWidget = {
  draw(host, opts = {}) {
    const STEPS = ['Diagnosing', 'Cleaning', 'LLM vs code'];
    return WidgetKit.scene(host, opts, {
      aria: 'A skill as blocks being diagnosed, cleaned and partly moved from the LLM to code', stillClock: 12, narrowAt: 520,
      height: s => s.narrow ? 470 : 340,
      buttons: [['next', 'Next step', s => { s.manual = true; s.at = s.clock; s.step = (s.step + 1) % 3; }], ['replay', 'Replay', s => { s.manual = false; s.step = 0; s.at = s.clock; }]],
      init(s) {
        const rnd = d3.randomLcg(4); s.step = 0; s.at = 0; s.manual = false;
        // kinds: ok, waste (tool call), cache (breaks prompt caching), long, viol (violation), det (deterministic -> code)
        const kinds = ['ok', 'ok', 'ok', 'ok', 'waste', 'cache', 'long', 'viol', 'det', 'ok', 'det'];
        s.blocks = d3.range(60).map(i => ({ id: i, kind: kinds[Math.floor(rnd() * kinds.length)], x: 0, y: 0, a: 1, lane: 'llm' }));
        s.g = s.svg.append('g'); s.t = s.svg.append('g');
      },
      layout(s) { s.mw = s.narrow ? s.W - 8 : 190; s.cols = s.narrow ? 12 : 22; s.bs = Math.min(34 * s.k, ((s.narrow ? s.W : s.W - s.mw - 24) - 8) / s.cols); },
      frame(s, dt) {
        const T = s.T, k = s.k; const age = s.clock - s.at;
        if (!s.manual && !s.still && age > 4.5) { s.step = (s.step + 1) % 3; s.at = s.clock; }
        const st = s.step, bad = b => b.kind === 'waste' || b.kind === 'cache' || b.kind === 'viol' || b.kind === 'long';
        const ease = s.still ? 1 : 1 - Math.exp(-dt * 6);
        // layout: visible blocks flow into rows; removed ones shrink; det blocks move to the code lane in step 2
        const llm = s.blocks.filter(b => !(st >= 1 && bad(b))), code = s.blocks.filter(b => st >= 2 && b.kind === 'det');
        const inLlm = llm.filter(b => !(st >= 2 && b.kind === 'det'));
        const place = (arr, y0, off) => arr.forEach((b, i) => { b.tx = 4 + (i % s.cols) * s.bs; b.ty = y0 + Math.floor(i / s.cols) * s.bs; });
        const rows = Math.ceil(s.blocks.length / s.cols); const y0 = 58 * k;
        place(inLlm, y0); place(code, y0 + (rows + 1.2) * s.bs + 28 * k);
        s.blocks.forEach(b => { const gone = st >= 1 && bad(b); b.a += ((gone ? 0 : 1) - b.a) * ease; if (b.tx != null && !gone) { b.x = b.x ? b.x + (b.tx - b.x) * ease : b.tx; b.y = b.y ? b.y + (b.ty - b.y) * ease : b.ty; } });
        const col = b => st === 0 ? ({ waste: T.bad, cache: '#d19b4a', long: T.mute, viol: T.bad }[b.kind] || T.ink) : b.kind === 'det' && st >= 2 ? T.gold : T.ink;
        const pulse = .55 + .45 * Math.sin(s.clock * 5);
        const r = s.g.selectAll('rect').data(s.blocks, b => b.id).join('rect');
        r.attr('x', b => b.x).attr('y', b => b.y).attr('width', b => Math.max(0, (s.bs - 3) * (b.kind === 'long' && st === 0 ? 1 : 1))).attr('height', b => (s.bs - 3) * (.35 + .65 * b.a))
          .attr('fill', col).attr('fill-opacity', b => b.a * (st === 0 && bad(b) ? .4 + .6 * pulse : (b.kind === 'ok' ? .35 : .8)));
        const toks = s.blocks.filter(b => !(st >= 1 && bad(b)) && !(st >= 2 && b.kind === 'det')).length, base = s.blocks.length;
        const bars = [['tokens', toks / base], ['time', (toks / base) * .9 + (st >= 2 ? 0 : .1) - (st >= 2 ? .05 : 0)], ['cost', (toks / base) * .95]];
        const mw = s.mw, bx = s.narrow ? 4 : s.W - mw - 4, by = s.narrow ? s.H - 66 * k : 34 * k;
        const mg = s.t.selectAll('g.m').data(bars, d => d[0]).join(e => { const g = e.append('g').attr('class', 'm'); g.append('rect').attr('class', 'bg'); g.append('rect').attr('class', 'fg'); WidgetKit.text(g.append('text'), 9, '.18em').style('text-transform', 'uppercase'); return g; });
        mg.attr('transform', (d, i) => `translate(${bx},${by + i * (s.narrow ? 22 : 16) * k})`);
        mg.select('.bg').attr('width', mw).attr('height', 5).attr('y', 4).attr('fill', T.faint);
        mg.select('.fg').attr('width', d => mw * Math.max(.04, d[1])).attr('height', 5).attr('y', 4).attr('fill', T.gold);
        mg.select('text').attr('y', -2).attr('fill', T.mute).text(d => `${d[0]}  ${Math.round(d[1] * 100)}%`);
        s.t.selectAll('text.cap').data([0]).join('text').attr('class', 'cap').attr('x', 4).attr('y', 20 * k).attr('fill', T.gold).style('font', '400 10px Jost').style('letter-spacing', '.22em').style('text-transform', 'uppercase')
          .text(`${st + 1} / 3 · ${STEPS[st]}`);
        s.t.selectAll('text.sub').data([0]).join('text').attr('class', 'sub').attr('x', 4).attr('y', 38 * k).attr('fill', T.mute).style('font', '300 13px Jost')
          .text(st === 0 ? 'Prompt caching · wasteful tool calls · speed and cost' : st === 1 ? 'Structure · length · violations — removed' : 'Deterministic steps move from the LLM to code');
        const laneY = y0 + (rows + .6) * s.bs;
        s.t.selectAll('text.lane').data(st >= 2 ? [['LLM', y0 - 6], ['Code', laneY + (rows) * s.bs * 0 + 0 + 30 * k]] : []).join('text').attr('class', 'lane').attr('x', 4).attr('text-anchor', 'start').attr('y', d => d[0] === 'LLM' ? y0 - 6 : y0 + (rows + 1.2) * s.bs + 20 * k)
          .attr('fill', T.mute).style('font', '400 9px Jost').style('letter-spacing', '.22em').text(d => d[0].toUpperCase());
      },
    });
  },
};
