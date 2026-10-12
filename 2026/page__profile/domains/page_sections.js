// Page order. The nav, scroll spy and bands come from here. chapter = a slug from content.js.
// To add a chapter: add its topics to content.md, then add one line here (and a widget in topic_widgets.js).
class PageSections {
  static all() {
    return [
      { id: 'about', nav: 'About', tone: 'light', kind: 'about' },
      { id: 'apps', nav: 'Apps', tone: 'dark', kind: 'apps', chapter: 'recent-apps' },
      { id: 'harness', nav: 'AI Harness', tone: 'light', kind: 'chapter', chapter: 'ai-harness-engineering' },
      { id: 'files', nav: 'Files', tone: 'dark', kind: 'chapter', chapter: 'llm-processing-for-millions-of-files' },
      { id: 'websites', nav: 'Websites', tone: 'light', kind: 'chapter', chapter: 'llm-summary-for-millions-of-websites-scale-and-speed' },
      { id: 'automation', nav: 'Automation', tone: 'dark', kind: 'chapter', chapter: 'llm-assisted-automation-pipelines' },
      { id: 'search', nav: 'Search', tone: 'light', kind: 'chapter', chapter: '10-million-records-search' },
      { id: 'bi', nav: 'BI Platform', tone: 'dark', kind: 'bi' },
      { id: 'youtube', nav: null, tone: 'light', kind: 'youtube' },
    ];
  }
  static chapter(slug) { return CONTENT.chapters.find(c => c.slug === slug); }
  static topic(slug) { return CONTENT.chapters.flatMap(c => c.topics).find(t => t.slug === slug); }
}
