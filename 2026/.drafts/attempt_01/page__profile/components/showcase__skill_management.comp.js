function ShowcaseSkillManagement() {
  return html`<${Showcase} variant="compact-grid">
    <div className="copy">
      <h3>Skill Management</h3>
      <p><b>Challenge:</b></p>
      <p>How should I manage skills when they grow 50+?</p><br />
      <p><b>What this does:</b></p>
      <p>Organises large libraries of AI skills into clear dependency layers and separates operational, authoring and project-specific skills for easier maintenance and reuse.</p>
    </div>
    <div className="visual split-visual" aria-label="Skill dependency and segregation diagram">
      <svg viewBox="0 0 980 310" role="img">
        <defs><marker id="arrow2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <text className="svg-kicker" x="90" y="52">DEPENDENCIES</text>
        <g className="stack">
          <rect x="86" y="82" width="170" height="62" rx="14"/><rect x="286" y="82" width="170" height="62" rx="14"/><rect x="486" y="82" width="170" height="62" rx="14"/>
          <text x="171" y="119">Core</text><text x="371" y="119">General</text><text x="571" y="119">Workflow</text>
          <path d="M256 113 H278 M456 113 H478" markerEnd="url(#arrow2)"/>
        </g>
        <text className="svg-kicker" x="90" y="204">SEGREGATION</text>
        <g className="lanes">
          <rect x="86" y="228" width="236" height="48" rx="12"/><rect x="342" y="228" width="236" height="48" rx="12"/><rect x="598" y="228" width="236" height="48" rx="12"/>
          <text x="204" y="258">Operational</text><text x="460" y="258">Authoring</text><text x="716" y="258">Projects</text>
        </g>
        <text className="big-number" x="835" y="132">50+</text>
      </svg>
    </div>

  <//>`;
}
