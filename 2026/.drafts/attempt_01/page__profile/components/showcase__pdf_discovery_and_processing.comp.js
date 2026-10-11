function ShowcasePdfDiscoveryAndProcessing() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>PDF Discovery & Processing</h3>
      <p><b>Challenge:</b></p>
      <p>Can we make sure we have all the data first?</p><br />
      <p><b>What this does:</b></p>
      <p>Discovers, collects, downloads and converts source documents into a consistent pipeline so the required data is available before analysis begins.</p>
    </div>
    <div className="visual">
      <svg viewBox="0 0 980 300" role="img" aria-label="PDF discovery pipeline">
        <defs><marker id="arrow4" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <g className="pipeline">
          <rect x="42" y="124" width="152" height="58" rx="16"/><rect x="225" y="124" width="152" height="58" rx="16"/><rect x="408" y="124" width="152" height="58" rx="16"/><rect x="591" y="124" width="152" height="58" rx="16"/><rect x="774" y="124" width="164" height="58" rx="16"/>
          <text x="118" y="159">Discover</text><text x="301" y="159">Harvest</text><text x="484" y="159">Download</text><text x="667" y="159">Convert</text><text x="856" y="159">Analyse</text>
          <path d="M194 153 H217 M377 153 H400 M560 153 H583 M743 153 H766" markerEnd="url(#arrow4)"/>
        </g>
        <g className="doc-stack"><rect x="455" y="66" width="30" height="38" rx="3"/><rect x="465" y="58" width="30" height="38" rx="3"/><rect x="475" y="50" width="30" height="38" rx="3"/></g>
      </svg>
    </div>

  <//>`;
}
