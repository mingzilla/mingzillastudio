function AboutBanner() {
  return html`<section className="banner wrap" aria-label="About">
    <p className="eyebrow">About</p>
      <p>I'm Ming, a <b>Software Architect</b>, <b>AI Engineer</b> with <strong>20+ years</strong> of experience building large scale software systems. I'm also a <b>Content Creator</b> who makes AI engineering related (<b>250+</b>) videos for knowledge sharing.</p>
      <p>Recently, I've been applying that experience to <b>AI coding</b>, <b>agent systems</b> and <b>automation</b> - building practical ways to keep AI-assisted systems scalable, reliable and maintainable as they grow.</p>
      <p>My current focus is converting that experience into <b>shareable skills</b> - reusable, proven practices that let others benefit without repeating the same work.</p>
    <div className="banner-cards">
      <article className="bcard">
        <div className="bcard-visual">
          <svg viewBox="0 0 200 120" role="img" aria-label="WHAT node dispatching to HOW variants, each with its own isolated test cases">
            <rect x="80" y="6" width="40" height="20" rx="10"/><text x="100" y="16">WHAT</text>
            <path d="M100 26 V36 H49 V43 M100 36 H151 V43"/>
            <circle cx="49" cy="58" r="15"/><circle cx="151" cy="58" r="15"/><text x="49" y="58">HOW1</text><text x="151" y="58">HOW2</text>
            <path d="M49 73 V79 H24 V88 M49 79 H74 V88"/>
            <path d="M151 73 V79 H126 V88 M151 79 H176 V88"/>
            <rect x="2" y="88" width="44" height="18" rx="9"/><text x="24" y="97">CASE1</text>
            <rect x="52" y="88" width="44" height="18" rx="9"/><text x="74" y="97">CASE2</text>
            <rect x="104" y="88" width="44" height="18" rx="9"/><text x="126" y="97">CASE3</text>
            <rect x="154" y="88" width="44" height="18" rx="9"/><text x="176" y="97">CASE4</text>
          </svg>
        </div>
        <div className="bcard-body">
          <h3>Harness Engineering for Coding</h3>
          <p>A small requirement shouldn't cause LLM to make widespread code and test changes. I structure code so responsibilities, implementation variants and their tests remain isolated.</p>
        </div>
        <div className="bcard-foot"><b>Keep AI code changes isolated</b></div>
      </article>
      <article className="bcard">
        <div className="bcard-visual">
          <svg viewBox="0 0 200 120" role="img" aria-label="Agent flowing into a harness">
            <text x="100" y="16">AGENT</text>
            <path d="M100 22 V34"/>
            <rect x="52" y="36" width="96" height="30" rx="9"/>
            <text x="100" y="51">Skills</text>
            <path d="M100 66 V82"/>
            <circle cx="100" cy="92" r="6"/>
          </svg>
        </div>
        <div className="bcard-body">
          <h3>Skill Optimisation</h3>
          <p>Quality, reliability, speed and cost shouldn't depend solely on whether an agent follows its instructions. I built an execution harnesses that enforce the process around it.</p>
        </div>
        <div className="bcard-foot"><b>Make agent execution reliable</b></div>
      </article>
      <article className="bcard">
        <div className="bcard-visual">
          <svg viewBox="0 0 200 120" role="img" aria-label="Process and UI kept apart by a boundary">
            <text x="55" y="16">PROCESS</text><text x="145" y="16">UI</text>
            <path d="M55 24 V104"/><path d="M145 24 V104"/>
            <path className="bcard-x" d="M84 46 L116 74 M116 46 L84 74"/>
          </svg>
        </div>
        <div className="bcard-body">
          <h3>AI Automation</h3>
          <p>Large automation systems shouldn't become fragile because the UI they operate against changes. I created a solution that allows LLM to operate with minimum changes.</p>
        </div>
        <div className="bcard-foot"><b>Make automation survive change</b></div>
      </article>
    </div>

  </section>`;
}
