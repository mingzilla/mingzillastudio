// Floating mini-map: a tiny copy of the hero map. dots: [{ id, x, y, section, app }]; click jumps; the current section glows.
function MiniMap({ dots, active, label, onJump }) {
  return html`
    <div className="minimap" role="navigation" aria-label="Chapter map">
      <p className="cur">${label}</p>
      <div className="field">
        ${dots.map(d => html`<button key=${d.id} className=${`dot ${d.app ? 'app' : ''} ${d.section === active ? 'on' : ''} ${d.me ? 'me' : ''}`} style=${{ left: d.x + '%', top: d.y + '%' }}
          aria-label=${d.label} onClick=${() => d.target && onJump(d.target)}></button>`)}
      </div>
    </div>`;
}
