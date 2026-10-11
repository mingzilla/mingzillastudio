// Hosts one d3 widget. Draws it while on screen, destroys it when far off screen. tone = the panel's tone ('dark'|'light').
function WidgetHost({ widget, tone, props, minHeight = 320 }) {
  const ref = useRef(), inst = useRef(null);
  const seen = useInView(ref);
  const W = WidgetRegistry.get(widget);
  useEffect(() => {
    if (seen && W && !inst.current) inst.current = W.draw(ref.current, { ...props, theme: WidgetTheme[tone], themeName: tone, reduceMotion }); ref.current.__w = inst.current;
    if (!seen && inst.current) { inst.current.destroy(); inst.current = null; }
  }, [seen]);
  useEffect(() => { if (inst.current) inst.current.setTheme(W.setThemeAdapter ? MapWidget.themes[tone] : WidgetTheme[tone]); }, [tone]);
  useEffect(() => () => { if (inst.current) inst.current.destroy(); }, []);
  return html`<div ref=${ref} className="widget-host" style=${{ minHeight: W ? minHeight : 120 }}>${W ? null : html`<p className="soon">interactive diagram coming</p>`}</div>`;
}
