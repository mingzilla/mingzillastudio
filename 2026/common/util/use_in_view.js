// true while the element is on (or just near) the screen AND the browser tab is visible.
function useInView(ref, margin = '80px') {
  const [near, setNear] = useState(false), [tab, setTab] = useState(!document.hidden);
  useEffect(() => {
    const onVis = () => setTab(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    if (!('IntersectionObserver' in window)) { setNear(true); return () => document.removeEventListener('visibilitychange', onVis); }
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin });
    io.observe(ref.current);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);
  return near && tab;   // only while the section is on screen and the tab is visible
}
