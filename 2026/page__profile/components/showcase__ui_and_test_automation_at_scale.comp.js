function ShowcaseUiAndTestAutomationAtScale() {
  return html`<${Showcase}>
    <div className="copy">
      <h3>UI & Test Automation at Scale</h3>
      <p><b>Challenge:</b></p>
      <p>How can I handle UI and Test Automation at Scale, and adapt UI changes in isolation?</p><br />
      <p><b>What this does:</b></p>
      <p>Structures UI automation into reusable elements, flows, tasks and wrappers so automated tests and interactions can adapt to application changes without rewriting components with dependencies.</p>
    </div>
    <div className="visual">
      <svg viewBox="0 0 980 340" role="img" aria-label="UI automation flow and element layers">
        <text className="svg-kicker" x="95" y="55">FLOW</text><text className="svg-kicker" x="655" y="55">ELEMENT</text>
        <g className="lane flow-lane"><rect x="75" y="82" width="350" height="190" rx="24"/><rect x="115" y="132" width="82" height="48" rx="12"/><rect x="211" y="132" width="82" height="48" rx="12"/><rect x="307" y="132" width="82" height="48" rx="12"/><text x="156" y="162">Flow</text><text x="252" y="162">Task</text><text x="348" y="162">Wrapper</text></g>
        <path className="isolation" d="M490 70 V282"/><text className="boundary-label" x="490" y="310">stable boundary</text>
        <g className="lane element-lane"><rect x="555" y="82" width="350" height="190" rx="24"/><rect x="595" y="132" width="82" height="48" rx="12"/><rect x="691" y="132" width="82" height="48" rx="12"/><rect x="787" y="132" width="82" height="48" rx="12"/><text x="636" y="162">Screen</text><text x="732" y="162">Panel</text><text x="828" y="162">Button</text></g>
        <text className="small-note" x="250" y="245">process stays stable</text><text className="small-note" x="730" y="245">UI can change</text>
      </svg>
    </div>

  <//>`;
}
