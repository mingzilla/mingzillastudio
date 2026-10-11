// links: [{ id, label }]; cta: { label, href }.
function TopNav({ links, cta }) {
  const { active, progress } = useScrollSpy(links.map(l => l.id));
  return html`
    <nav className="topnav" aria-label="Primary">
      <div className="progress" style=${{ transform: `scaleX(${progress})` }}></div>
      <a className="brand" href="#top">Ming Huang</a>
      <ul className="nav-links">
        ${links.map(l => html`<li key=${l.id}><a href=${'#' + l.id} className=${active === l.id ? 'on' : ''} onClick=${e => { e.preventDefault(); scrollToId(l.id); }}>${l.label}</a></li>`)}
        <li><a className="cta" href=${cta.href} target="_blank" rel="noreferrer">${cta.label}</a></li>
      </ul>
    </nav>`;
}
