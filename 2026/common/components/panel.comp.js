// A framed panel with a gold corner; `action` sits top-right of the caption row. It inverts its band: light on dark bands, dark on light bands. keepDark: always dark.
function Panel({ label, action, keepDark, className = '', children }) {
  return html`<div className=${`panel ${keepDark ? 'keep-dark' : ''} ${className}`}>${label || action ? html`<div className="panel-head"><p className="label">${label}</p>${action}</div>` : null}${children}</div>`;
}
