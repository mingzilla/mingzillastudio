function ShowcasePdfTextTables() {
  return html`<${Showcase} variant="featured">
    <div className="copy">
      <h3>PDF Text → Tables</h3>
      <p><b>Challenge:</b></p>
      <p>At 5 min per record, processing millions via LLM is impossible.</p><br />
      <p><b>What this does:</b></p>
      <p>Classifies files by type, format and generation method, splits them into logical shards, then extracts required fields into structured data using scalable, rule-based processing.</p>
    </div>
    <div className="visual decision-visual">
      <svg viewBox="0 0 980 520" role="img" aria-label="Dimension classify split and extract solution with traceable decision tree">
        <defs><marker id="arrow5" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <text className="svg-kicker" x="52" y="55">THE SOLUTION</text>
        <g className="top-pipeline">
          <rect x="52" y="84" width="158" height="64" rx="16"/><rect x="274" y="84" width="158" height="64" rx="16"/><rect x="496" y="84" width="158" height="64" rx="16"/><rect x="718" y="84" width="158" height="64" rx="16"/>
          <text x="131" y="122">Dimension</text><text x="353" y="122">Classify</text><text x="575" y="122">Split</text><text x="797" y="122">Extract</text>
          <path d="M210 116 H266 M432 116 H488 M654 116 H710" markerEnd="url(#arrow5)"/>
        </g>
        <g className="dimension-tags chips">
          <rect x="82" y="177" width="92" height="36" rx="18"/><rect x="82" y="224" width="92" height="36" rx="18"/><rect x="82" y="271" width="92" height="36" rx="18"/>
          <text x="128" y="200">Type</text><text x="128" y="247">Format</text><text x="128" y="294">Generation</text>
        </g>
        <g className="tree">
          <circle cx="352" cy="200" r="18"/><circle cx="300" cy="275" r="14"/><circle cx="404" cy="275" r="14"/><circle cx="278" cy="350" r="12"/><circle cx="326" cy="350" r="12"/><circle cx="382" cy="350" r="12"/><circle cx="430" cy="350" r="12"/>
          <path d="M352 218 L300 261 M352 218 L404 261 M300 289 L278 338 M300 289 L326 338 M404 289 L382 338 M404 289 L430 338"/>
          <text className="tree-label" x="352" y="400">pattern → algorithm</text>
        </g>
        <g className="exit-list">
          <text className="svg-kicker" x="515" y="198">TRACEABLE EXIT</text>
          <rect x="515" y="217" width="356" height="46" rx="12"/><rect x="515" y="275" width="356" height="46" rx="12"/><rect x="515" y="333" width="356" height="46" rx="12"/>
          <text x="535" y="246">EXIT__TABLE_LAYOUT_A</text><text x="535" y="304">EXIT__TABLE_LAYOUT_B</text><text x="535" y="362">EXIT__HARD_TO_HANDLE_BY_CODE</text>
        </g>
        <g className="coverage">
          <text className="coverage-big" x="85" y="470">100%</text><text className="coverage-label" x="211" y="470">classified</text>
          <text className="coverage-big accent-text" x="560" y="470">~12%</text><text className="coverage-label" x="672" y="470">long tail</text>
        </g>
      </svg>
    </div>
    <div className="result-strip"><strong>1.62M pages</strong><span>deterministic first · LLM for the long tail</span></div>

  <//>`;
}
