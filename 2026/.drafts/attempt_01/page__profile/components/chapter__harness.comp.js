function ChapterHarness({ no }) {
  return html`<${Chapter} id="harness" no=${no} title="AI Harness Engineering">
    <${ShowcaseCoWorkAgentTeam} />
    <${ShowcaseSkillSharing} />
    <${ShowcaseSkillManagement} />
    <${ShowcaseSkillOptimisation} />
  <//>`;
}
