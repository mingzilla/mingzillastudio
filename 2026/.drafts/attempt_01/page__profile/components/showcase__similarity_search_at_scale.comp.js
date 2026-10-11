function ShowcaseSimilaritySearchAtScale() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>Similarity Search at Scale</h3>
      <p><b>Challenge:</b></p>
      <p>Maintain a vector store beyond 10 million records.</p><br />
      <p><b>What this does:</b></p>
      <p>Builds and operates a vector database capable of storing and searching more than 10 million records while balancing storage size, creation speed and query performance.</p>
    </div>
    <div className="visual">
      <svg viewBox="0 0 980 330" role="img" aria-label="Large vector database scale visual">
        <g className="dot-field">
          <circle cx="80" cy="85" r="5"/><circle cx="105" cy="85" r="5"/><circle cx="130" cy="85" r="5"/><circle cx="155" cy="85" r="5"/><circle cx="180" cy="85" r="5"/><circle cx="205" cy="85" r="5"/><circle cx="230" cy="85" r="5"/><circle cx="255" cy="85" r="5"/><circle cx="280" cy="85" r="5"/><circle cx="305" cy="85" r="5"/>
          <circle cx="92" cy="110" r="5"/><circle cx="117" cy="110" r="5"/><circle cx="142" cy="110" r="5"/><circle cx="167" cy="110" r="5"/><circle cx="192" cy="110" r="5"/><circle cx="217" cy="110" r="5"/><circle cx="242" cy="110" r="5"/><circle cx="267" cy="110" r="5"/><circle cx="292" cy="110" r="5"/>
          <circle cx="80" cy="135" r="5"/><circle cx="105" cy="135" r="5"/><circle cx="130" cy="135" r="5"/><circle cx="155" cy="135" r="5"/><circle cx="180" cy="135" r="5"/><circle cx="205" cy="135" r="5"/><circle cx="230" cy="135" r="5"/><circle cx="255" cy="135" r="5"/><circle cx="280" cy="135" r="5"/><circle cx="305" cy="135" r="5"/>
          <circle cx="92" cy="160" r="5"/><circle cx="117" cy="160" r="5"/><circle cx="142" cy="160" r="5"/><circle cx="167" cy="160" r="5"/><circle cx="192" cy="160" r="5"/><circle cx="217" cy="160" r="5"/><circle cx="242" cy="160" r="5"/><circle cx="267" cy="160" r="5"/><circle cx="292" cy="160" r="5"/>
        </g>
        <path className="accent-arrow" d="M350 125 H475"/>
        <g className="db"><ellipse cx="595" cy="90" rx="82" ry="25"/><path d="M513 90 V205 C513 219 550 230 595 230 C640 230 677 219 677 205 V90"/><ellipse cx="595" cy="205" rx="82" ry="25"/><text x="595" y="156">VECTOR DB</text></g>
        <g className="metric-cluster"><text className="big-number" x="760" y="115">10M+</text><text className="metric-label" x="762" y="145">records</text><text className="metric-small" x="762" y="188">50GB+</text><text className="metric-small" x="762" y="220">creation speed</text><text className="metric-small" x="762" y="252">query speed</text></g>
      </svg>
    </div>

  <//>`;
}
