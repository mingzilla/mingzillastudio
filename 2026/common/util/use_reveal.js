// Adds `visible` once the element scrolls into view. Returns [ref, visible].
function useReveal() {
  const ref = useRef();
  const [visible, setVisible] = useState(reduceMotion || !('IntersectionObserver' in window));
  useEffect(() => {
    if (visible) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}
