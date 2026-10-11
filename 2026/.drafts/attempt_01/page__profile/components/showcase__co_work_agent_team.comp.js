function ShowcaseCoWorkAgentTeam() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>Co-work Agent Team</h3>
      <p><b>Challenge:</b></p>
      <p>How can I go to bed and my agent teams still do work for me reliably?</p><br />
      <p><b>What this does:</b></p>
      <p>Enables multiple AI agents to work together autonomously over long-running tasks, with defined roles, workflows, reviews, handovers and reliability controls.</p>
    </div>
    <div className="visual visual-agents" aria-label="Agent team workflow diagram">
      <svg viewBox="0 0 980 390" role="img">
        <defs><marker id="arrow1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <g className="muted-line">
          <path d="M175 90 H805" />
          <path d="M130 228 H850" />
        </g>
        <g className="agent-row">
          <circle cx="190" cy="90" r="44"/><circle cx="390" cy="90" r="44"/><circle cx="590" cy="90" r="44"/><circle cx="790" cy="90" r="44"/>
          <text x="190" y="95">Worker</text><text x="390" y="95">Reviewer</text><text x="590" y="95">Researcher</text><text x="790" y="95">Supervisor</text>
        </g>
        <g className="flow-row">
          <rect x="88" y="205" width="132" height="48" rx="14"/><rect x="256" y="205" width="132" height="48" rx="14"/><rect x="424" y="205" width="132" height="48" rx="14"/><rect x="592" y="205" width="132" height="48" rx="14"/><rect x="760" y="205" width="132" height="48" rx="14"/>
          <text x="154" y="235">Ticket</text><text x="322" y="235">Proposal</text><text x="490" y="235">Implement</text><text x="658" y="235">Review</text><text x="826" y="235">Document</text>
          <path d="M220 229 H248 M388 229 H416 M556 229 H584 M724 229 H752" markerEnd="url(#arrow1)"/>
        </g>
        <g className="chips">
          <rect x="248" y="310" width="118" height="40" rx="20"/><rect x="390" y="310" width="118" height="40" rx="20"/><rect x="532" y="310" width="200" height="40" rx="20"/>
          <text x="307" y="335">Hooks</text><text x="449" y="335">Rules</text><text x="632" y="335">Handover / recovery</text>
        </g>
      </svg>
    </div>

  <//>`;
}
