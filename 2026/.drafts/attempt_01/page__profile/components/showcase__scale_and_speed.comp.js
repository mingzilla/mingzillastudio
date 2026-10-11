function ShowcaseScaleAndSpeed() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>Scale & Speed</h3>
      <p><b>Challenge:</b></p>
      <p>How can we finish processing millions of long text with LLM very fast and accurate?</p><br />
      <p><b>What this does:</b></p>
      <p>Cleans and processes large volumes of web text through an optimised LLM pipeline to generate fast, accurate summaries and enable downstream similarity analysis.</p>
    </div>
    <div className="visual">
      <svg viewBox="0 0 980 300" role="img" aria-label="Website summarisation pipeline">
        <defs><marker id="arrow6" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <g className="pipeline">
          <rect x="52" y="124" width="150" height="58" rx="16"/><rect x="235" y="124" width="150" height="58" rx="16"/><rect x="418" y="124" width="150" height="58" rx="16"/><rect className="accent-node" x="601" y="112" width="150" height="82" rx="18"/><rect x="784" y="124" width="150" height="58" rx="16"/>
          <text x="127" y="159">Web text</text><text x="310" y="159">Clean</text><text x="493" y="159">Prompt</text><text className="accent-node-text" x="676" y="145">Summary</text><text className="metric-in-node" x="676" y="174">1.5s/site</text><text x="859" y="159">Similarity</text>
          <path d="M202 153 H227 M385 153 H410 M568 153 H593 M751 153 H776" markerEnd="url(#arrow6)"/>
        </g>
      </svg>
    </div>
    <div className="result-strip"><strong>1.2M websites</strong><span>raw text reduced to ~33% before inference</span></div>

  <//>`;
}
