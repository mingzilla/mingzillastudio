// Which section id is current, and how far down the page we are (0..1).
function useScrollSpy(ids) {
  const [state, setState] = useState({ active: '', progress: 0 });
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      let active = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.35) active = id;
      }
      setState({ active, progress: max > 0 ? scrollY / max : 0 });
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [ids.join()]);
  return state;
}
