function ShowcaseSkillOptimisation() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>Skill Optimisation</h3>
      <p><b>Challenge:</b></p>
      <p>How can we optimize skills, keep it shorter and runs more reliably?</p><br />
      <p><b>What this does:</b></p>
      <p>Diagnoses and improves AI skills to make them shorter, faster, cheaper and more reliable, while deciding which responsibilities belong in prompts versus code.</p>
    </div>
    <div className="visual" aria-label="Skill optimisation visual">
      <svg viewBox="0 0 980 330" role="img">
        <g className="before-bars">
          <rect x="90" y="80" width="310" height="24" rx="8"/><rect x="90" y="118" width="350" height="24" rx="8"/><rect x="90" y="156" width="285" height="24" rx="8"/><rect x="90" y="194" width="330" height="24" rx="8"/>
          <text className="svg-kicker" x="90" y="55">BEFORE</text>
        </g>
        <path className="accent-arrow" d="M462 150 H578"/>
        <g className="after-bars">
          <rect x="618" y="105" width="190" height="24" rx="8"/><rect x="618" y="143" width="144" height="24" rx="8"/><rect x="618" y="181" width="170" height="24" rx="8"/>
          <text className="svg-kicker" x="618" y="80">AFTER</text>
        </g>
        <g className="chips">
          <rect x="146" y="266" width="170" height="40" rx="20"/><rect x="344" y="266" width="170" height="40" rx="20"/><rect x="542" y="266" width="210" height="40" rx="20"/>
          <text x="231" y="291">Prompt cache</text><text x="429" y="291">Tool calls</text><text x="647" y="291">LLM → code</text>
        </g>
      </svg>
    </div>

  <//>`;
}
