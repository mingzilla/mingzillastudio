// A Panel + WidgetHost with a Play / Stop button top-right. Never auto-plays: it shows the still frame until the visitor presses Play.
// bandTone: the band the panel sits on (the panel inverts it). keepDark: always a dark panel.
function WidgetPanel({ label, widget, bandTone, keepDark, props, minHeight }) {
  const [playing, setPlaying] = useState(false);
  const tone = keepDark ? 'dark' : bandTone === 'dark' ? 'light' : 'dark';
  const action = html`<button className="play" aria-pressed=${playing} aria-label=${playing ? 'Stop the animation' : 'Play the animation'} onClick=${() => setPlaying(!playing)}>${playing ? '■ Stop' : '▶ Play'}</button>`;
  return html`<${Panel} label=${label} action=${action} keepDark=${keepDark}><${WidgetHost} widget=${widget} tone=${tone} props=${props} minHeight=${minHeight} playing=${playing} /><//>`;
}
