// A full-width band. tone: 'dark' | 'light'. Panels inside invert the tone.
function Band({ tone, id, extra = '', children }) {
  return html`<div className=${`band ${tone} ${extra}`} id=${id}><div className="wrap">${children}</div></div>`;
}
