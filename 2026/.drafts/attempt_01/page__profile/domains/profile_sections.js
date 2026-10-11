// Page order. To add a section: write its chapter__<name>.comp.js and add one line here.
// numbered: gets the next chapter number. nav: label in the top nav (omit to hide).
class ProfileSections {
  static all() {
    return [
      { id: 'harness', nav: 'AI Harness', numbered: true, Comp: ChapterHarness },
      { id: 'millions-files', nav: 'LLM Processing (1m+)', numbered: true, Comp: ChapterMillionsFiles },
      { id: 'websites', nav: 'LLM Summary (1m+)', numbered: true, Comp: ChapterWebsites },
      { id: 'automation', nav: 'Automation', numbered: true, Comp: ChapterAutomation },
      { id: 'search-scale', nav: 'Search', numbered: true, Comp: ChapterSearchScale },
      { id: 'bi-platform', nav: 'BI Platform', Comp: ChapterBiPlatform },
      ...AppCatalog.all().map(app => ({ id: app.id, nav: app.nav, numbered: true, Comp: AppChapter, props: { app } })),
      { id: 'connect', nav: 'Connect', Comp: ChapterConnect },
    ];
  }
}
