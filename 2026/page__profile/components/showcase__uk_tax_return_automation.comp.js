function ShowcaseUkTaxReturnAutomation() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>UK Tax Return Automation</h3>
      <p><b>Challenge:</b></p>
      <p>Handle Tax Return Automatically with Accuracy and Idempotency.</p><br />
      <p><b>What this does:</b></p>
      <p>Automates the end-to-end tax-document workflow, from collecting and organising source files through extraction, verification and report generation, with repeatable and accurate processing.</p>
    </div>
    <div className="visual">
      <svg viewBox="0 0 980 300" role="img" aria-label="Tax return automation pipeline">
        <defs><marker id="arrow8" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <g className="pipeline tiny"><rect x="30" y="124" width="112" height="56" rx="14"/><rect x="164" y="124" width="112" height="56" rx="14"/><rect x="298" y="124" width="112" height="56" rx="14"/><rect x="432" y="124" width="112" height="56" rx="14"/><rect x="566" y="124" width="112" height="56" rx="14"/><rect x="700" y="124" width="112" height="56" rx="14"/><rect x="834" y="124" width="116" height="56" rx="14"/>
          <text x="86" y="158">Inbox</text><text x="220" y="158">Files</text><text x="354" y="158">Normalise</text><text x="488" y="158">Group</text><text x="622" y="158">Extract</text><text x="756" y="158">Verify</text><text x="892" y="158">Report</text>
          <path d="M142 152 H156 M276 152 H290 M410 152 H424 M544 152 H558 M678 152 H692 M812 152 H826" markerEnd="url(#arrow8)"/>
        </g>
      </svg>
    </div>

  <//>`;
}
