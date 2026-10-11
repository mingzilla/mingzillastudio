function ChapterSearchScale({ no }) {
  return html`<${Chapter} id="search-scale" no=${no} title="10 Million Records Search">
    <${ShowcaseSimilaritySearchAtScale} />
    <${ShowcaseSmartSearchAtScale} />
  <//>`;
}
