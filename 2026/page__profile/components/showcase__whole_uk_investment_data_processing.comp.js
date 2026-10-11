function ShowcaseWholeUkInvestmentDataProcessing() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>Whole UK Investment Data Processing</h3>
      <p><b>Challenge:</b></p>
      <p>How can we process data for an unfamiliar domain?</p><br />
      <p><b>What this does:</b></p>
      <p>Builds a structured understanding of an unfamiliar domain by researching its taxonomy, decision logic and rules before applying them to large-scale data processing.</p>
    </div>
    <div className="visual">
      <svg viewBox="0 0 980 300" role="img" aria-label="Research to decision model flow">
        <defs><marker id="arrow3" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <g className="pipeline large">
          <rect x="80" y="120" width="230" height="68" rx="18"/><rect x="375" y="120" width="230" height="68" rx="18"/><rect x="670" y="120" width="230" height="68" rx="18"/>
          <text x="195" y="160">Taxonomy</text><text x="490" y="160">Decision tree</text><text x="785" y="160">Simplify</text>
          <path d="M310 154 H365 M605 154 H660" markerEnd="url(#arrow3)"/>
        </g>
      </svg>
    </div>

  <//>`;
}
