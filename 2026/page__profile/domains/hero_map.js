// The hero map: which topic each bubble stands for, its figure, and where it sits (ax/ay desktop, mx/my narrow).
class HeroMap {
  static nodes() {
    const ch = s => PageSections.topic(s).challenge;
    return [
      { id: 'me', kind: 'me', label: 'Ming', weight: 0, ax: .5, ay: .5, mx: .5, my: .5 },
      { id: 'harness', kind: 'cluster', label: 'Harness', figure: '50+ skills', weight: .65, ax: .2, ay: .24, mx: .22, my: .22, target: 'harness', section: 'harness', challenge: ch('co-work-agent-team') },
      { id: 'search', kind: 'cluster', label: 'Search', figure: '10M+', weight: 1, ax: .8, ay: .2, mx: .72, my: .14, target: 'search', section: 'search', challenge: ch('smart-search-at-scale-micro-services') },
      { id: 'websites', kind: 'cluster', label: 'Websites', figure: '1m+', weight: .8, ax: .84, ay: .72, mx: .78, my: .72, target: 'websites', section: 'websites', challenge: ch('llm-summary-for-millions-of-websites-scale-and-speed') },
      { id: 'files', kind: 'cluster', label: 'Files', figure: '1m+', weight: .8, ax: .5, ay: .86, mx: .42, my: .84, target: 'files', section: 'files', challenge: ch('pdf-extracted-text-to-tables-llm-with-code') },
      { id: 'automation', kind: 'cluster', label: 'Automation', weight: .6, ax: .16, ay: .72, mx: .16, my: .66, target: 'automation', section: 'automation', challenge: ch('ui-and-test-automation-at-scale') },
      { id: 'simzilla', kind: 'app', label: 'Simzilla', figure: '2 days', weight: .35, ax: .38, ay: .14, mx: .46, my: .33, target: 'simzilla-llm-driven-game-world', section: 'apps', challenge: ch('simzilla-llm-driven-game-world') },
      { id: 'upskill', kind: 'app', label: 'Upskill', weight: .35, ax: .66, ay: .42, mx: .75, my: .42, target: 'upskill-skill-sharing-app', section: 'apps', challenge: ch('upskill-skill-sharing-app') },
    ];
  }
}
