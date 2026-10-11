// topic slug -> d3 widget (see common/widgets/registry.js) and the caption on its panel.
class TopicWidgets {
  static for(slug) {
    const m = {
      'co-work-agent-team': ['team', 'night shift — turn rules & hooks off and watch what ships'],
      'skill-management': ['skills', '50+ skills — click one to see what depends on it; split into islands'],
      'skill-optimisation': ['optimise', 'one skill, before and after — clean it, then move work from the LLM to code'],
      'harness-engineering-for-coding': ['isolation', 'the same small change, two codebases — click any node to change it'],
      'whole-uk-investment-data-processing': ['domain', 'an unfamiliar domain — research it, then drop a company through the decision tree'],
      'pdf-discovery-and-processing-pipeline': ['discovery', 'discover → harvest → download → convert, until nothing is missing'],
      'pdf-extracted-text-to-tables-llm-with-code': ['race', 'the same 1,000,000 records, two ways'],
      'llm-summary-for-millions-of-websites-scale-and-speed': ['wall', 'clean → prompt → summarise, then group by similarity — hover a tile'],
      'ui-and-test-automation-at-scale': ['uiauto', 'change the UI — only the element layer blinks'],
      'videos-to-knowledge-base': ['video', 'an hour of video, reduced to what matters to you'],
      'automation-handle-uk-tax-return': ['tax', 'from inbox to report — run it twice and nothing changes'],
      'similarity-search-at-scale-vector-db': ['vectors', '10M+ rows — click a point, find its neighbours'],
      'smart-search-at-scale-micro-services': ['search', 'live traffic — kill an API, add traffic, then add APIs to recover'],
    };
    return m[slug] || null;
  }
}
