function Hero() {
  return html`
    <header className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Ming Huang</p>
          <h1>Software Architect / <span className="grad">AI Engineer</span></h1>
          <p className="hero-sub">Making AI-assisted development work <b>at scale</b></p>
          <a className="down" href="#harness" aria-label="Scroll to projects">↓</a>
        </div>
        <div className="hero-viz"><${Network} /></div>
      </div>
    </header>`;
}
