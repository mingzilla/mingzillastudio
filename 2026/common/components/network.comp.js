// d3 force network: 3 clusters of drifting nodes, pushed away by the pointer.
function Network() {
  const ref = useRef();
  useEffect(() => {
    const svg = d3.select(ref.current);
    const centers = [[150, 130], [380, 170], [220, 320]];
    const nodes = d3.range(54).map(i => ({ id: i, g: i % 3, r: i < 3 ? 9 : 2.5 + (i % 5) }));
    const rnd = d3.randomLcg(7);
    const links = nodes.filter(n => n.id >= 3).map(n => ({ source: n.id, target: n.g }))
      .concat(d3.range(20).map(() => ({ source: 3 + Math.floor(rnd() * 51), target: 3 + Math.floor(rnd() * 51) })));
    const color = ['#5a57ff', '#111318', '#00b3a4'];

    const link = svg.append('g').attr('stroke', '#c9ccd3').attr('stroke-opacity', .7).selectAll('line').data(links).join('line');
    const node = svg.append('g').selectAll('circle').data(nodes).join('circle')
      .attr('r', d => d.r).attr('fill', d => color[d.g]).attr('fill-opacity', d => d.id < 3 ? 1 : .75);

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).distance(38).strength(.25))
      .force('charge', d3.forceManyBody().strength(-26))
      .force('x', d3.forceX(d => centers[d.g][0]).strength(.07))
      .force('y', d3.forceY(d => centers[d.g][1]).strength(.07))
      .force('collide', d3.forceCollide(d => d.r + 2))
      .alphaDecay(reduceMotion ? .2 : 0).velocityDecay(.35)
      .on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        node.attr('cx', d => d.x).attr('cy', d => d.y);
      });
    svg.on('pointermove', e => {
      const [px, py] = d3.pointer(e);
      nodes.forEach(n => {
        const dx = n.x - px, dy = n.y - py, d = Math.hypot(dx, dy);
        if (d < 70 && d > 0) { n.vx += dx / d * 1.2; n.vy += dy / d * 1.2; }
      });
      sim.alpha(Math.max(sim.alpha(), .15)).restart();
    });
    const idle = reduceMotion ? 0 : setInterval(() => sim.alpha(Math.max(sim.alpha(), .08)).restart(), 2500);
    return () => { sim.stop(); clearInterval(idle); svg.on('pointermove', null).selectAll('*').remove(); };
  }, []);
  return html`<svg ref=${ref} viewBox="0 0 520 420" className="network" role="img" aria-label="Network of agents, scale and automation"></svg>`;
}
