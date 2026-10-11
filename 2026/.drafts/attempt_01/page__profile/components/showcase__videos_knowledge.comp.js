function ShowcaseVideosKnowledge() {
  return html`<${Showcase} variant="two-up">
    <div className="copy">
      <h3>Videos → Knowledge</h3>
      <p><b>Challenge:</b></p>
      <p>How can I consume knowledge quickly if a video has content relevant to me?</p><br />
      <p><b>What this does:</b></p>
      <p>Converts videos into searchable, human-friendly knowledge by extracting transcripts, restructuring the content and identifying the information most relevant to the user.</p>
    </div>
    <div className="visual mini">
      <svg viewBox="0 0 980 250" role="img" aria-label="Video to knowledge flow">
        <defs><marker id="arrow7" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <g className="pipeline large"><rect x="80" y="92" width="230" height="64" rx="16"/><rect x="375" y="92" width="230" height="64" rx="16"/><rect x="670" y="92" width="230" height="64" rx="16"/><text x="195" y="130">Transcript</text><text x="490" y="130">Readable notes</text><text x="785" y="130">Relevant analysis</text><path d="M310 124 H365 M605 124 H660" markerEnd="url(#arrow7)"/></g>
      </svg>
    </div>

  <//>`;
}
