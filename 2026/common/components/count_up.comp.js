// d3 transition counting 0 -> value once scrolled into view.
function CountUp({ value, delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    if (reduceMotion) return;
    const el = d3.select(ref.current).text(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      el.transition().delay(delay).duration(1400).ease(d3.easeCubicOut)
        .textTween(() => t => Math.round(d3.interpolateNumber(0, value)(t)));
    }, { threshold: .6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return html`<span ref=${ref}>${value}</span>`;
}
