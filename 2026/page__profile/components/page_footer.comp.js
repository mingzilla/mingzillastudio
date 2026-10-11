function PageFooter() {
  return html`<footer className="footer"><span>© Ming Huang</span><a href="#top" onClick=${e => { e.preventDefault(); scrollToId('top'); }}>Back to top ↑</a></footer>`;
}
