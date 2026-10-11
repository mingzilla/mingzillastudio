// **bold** and [text](url) in a string -> elements.
function Rich({ text }) {
  const parts = [], re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g; let last = 0, m, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(m[1] ? html`<strong key=${i++}>${m[1]}</strong>` : html`<a key=${i++} href=${m[3]}>${m[2]}</a>`);
    last = re.lastIndex;
  }
  parts.push(text.slice(last));
  return html`<${React.Fragment}>${parts}<//>`;
}
