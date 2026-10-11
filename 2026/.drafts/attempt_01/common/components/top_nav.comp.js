// links: [{ id, label }] - the section ids to track.
function TopNav({ links }) {
  const { active, progress } = useScrollSpy(links.map(l => l.id));
  return html`
    <nav className="topnav" aria-label="Primary">
      <div className="progress" style=${{ transform: `scaleX(${progress})` }}></div>
      <div className="wrap nav-inner">
        <a className="brand" href="#" aria-label="Back to top">Ming Huang</a>
        <ul className="nav-links">
          ${links.map(l => html`<li key=${l.id}><a href=${'#' + l.id} className=${active === l.id ? 'on' : ''}>${l.label}</a></li>`)}
        </ul>
      </div>
    </nav>`;
}
