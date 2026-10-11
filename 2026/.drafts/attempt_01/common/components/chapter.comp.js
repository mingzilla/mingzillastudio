function Chapter({ id, no, title, children }) {
  return html`
    <section className="chapter wrap" id=${id}>
      <header className="chapter-head">
        <span className="chapter-no">${String(no).padStart(2, '0')}</span>
        <h2>${title}</h2>
      </header>
      ${children}
    </section>`;
}
