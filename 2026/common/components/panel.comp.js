// A framed panel with a gold corner. It inverts its band: light on dark bands, dark on light bands. keepDark: always dark.
function Panel({ label, keepDark, className = '', children }) {
  return html`<div className=${`panel ${keepDark ? 'keep-dark' : ''} ${className}`}>${label ? html`<p className="label">${label}</p>` : null}${children}</div>`;
}
