function ShowcaseSmartSearchAtScale() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>Smart Search at Scale</h3>
      <p><b>Challenge:</b></p>
      <p>Scale query traffic independently.</p><br />
      <p><b>What this does:</b></p>
      <p>Provides scalable search across more than 10 million records using a distributed architecture with load balancing, multiple APIs, caching and a database backend.</p>
    </div>
    <div className="visual">
      <svg viewBox="0 0 980 300" role="img" aria-label="Microservice smart search pipeline">
        <defs><marker id="arrow9" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs>
        <g className="pipeline"><rect x="58" y="124" width="140" height="58" rx="16"/><rect x="244" y="124" width="168" height="58" rx="16"/><rect x="458" y="91" width="150" height="44" rx="12"/><rect x="458" y="145" width="150" height="44" rx="12"/><rect x="458" y="199" width="150" height="44" rx="12"/><rect x="654" y="124" width="130" height="58" rx="16"/><rect x="830" y="124" width="110" height="58" rx="16"/>
          <text x="128" y="159">UI</text><text x="328" y="159">Load balancer</text><text x="533" y="119">API</text><text x="533" y="173">API</text><text x="533" y="227">API</text><text x="719" y="159">Cache</text><text x="885" y="159">DB</text>
          <path d="M198 153 H236 M412 153 H450 M608 153 H646 M784 153 H822" markerEnd="url(#arrow9)"/>
        </g>
      </svg>
    </div>

  <//>`;
}
