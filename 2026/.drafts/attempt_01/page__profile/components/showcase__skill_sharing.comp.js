function ShowcaseSkillSharing() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>Skill Sharing</h3>
      <p><b>Challenge:</b></p>
      <p>How can I share skills with friends?</p><br />
      <p><b>What this does:</b></p>
      <p>Makes sharing a skill a one-sentence action, and receiving one just as simple, so friends keep passing on what already works for them.</p><br />
      <p><b>Links:</b></p>
      <p><a href="https://github.com/mingzilla/upskill/" target="_blank" rel="noreferrer">GitHub</a> · <a href="https://www.youtube.com/watch?v=fHlu_i5Ul3U" target="_blank" rel="noreferrer">Video</a></p>
    </div>
    <div className="visual" aria-label="Skill sharing exchange diagram">
      <svg viewBox="0 0 980 350" role="img">
        <defs><marker id="arrow10" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <g className="agent-row">
          <circle cx="150" cy="100" r="40"/><circle cx="830" cy="100" r="40"/>
          <text x="150" y="105">Ming</text><text x="830" y="105">Ken</text>
          <circle cx="150" cy="230" r="40"/><circle cx="830" cy="230" r="40"/>
          <text x="150" y="235">Ming</text><text x="830" y="235">Ken</text>
        </g>
        <g className="flow-row">
          <rect x="380" y="70" width="220" height="60" rx="14"/><text x="490" y="100">Ming's skills</text>
          <path d="M192 100 H370" markerEnd="url(#arrow10)"/><path d="M610 100 H786" markerEnd="url(#arrow10)"/>
          <rect x="380" y="200" width="220" height="60" rx="14"/><text x="490" y="230">Ken's skills</text>
          <path d="M788 230 H612" markerEnd="url(#arrow10)"/><path d="M370 230 H194" markerEnd="url(#arrow10)"/>
        </g>
        <g>
          <text className="small-note" x="281" y="80">share</text><text className="small-note" x="698" y="80">receive</text>
          <text className="small-note" x="698" y="210">share</text><text className="small-note" x="281" y="210">receive</text>
        </g>
        <g className="chips">
          <rect x="106" y="292" width="336" height="40" rx="20"/><rect x="490" y="292" width="384" height="40" rx="20"/>
          <text x="274" y="313">"share ${'<skill>'} skill"</text><text x="682" y="313">"add ${'<skill>'} skill from Ming"</text>
        </g>
      </svg>
    </div>

  <//>`;
}
