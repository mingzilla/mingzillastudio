function ChapterAutomation({ no }) {
  return html`<${Chapter} id="automation" no=${no} title="LLM Assisted Automation Pipelines">
    <${ShowcaseUiAndTestAutomationAtScale} />
    <${ShowcaseVideosKnowledge} />
    <${ShowcaseUkTaxReturnAutomation} />
  <//>`;
}
