function ProfilePage() {
  const sections = ProfileSections.all();
  let no = 0;
  return html`
    <${TopNav} links=${sections.filter(s => s.nav).map(s => ({ id: s.id, label: s.nav }))} />
    <${Hero} />
    <${AboutBanner} />
    <${StatStrip} />
    <main id="projects">
      <${ProjectsIntro} />
      ${sections.map(s => html`<${s.Comp} key=${s.id} ...${s.props} no=${s.numbered ? ++no : undefined} />`)}
    </main>
    <${PageFooter} />`;
}
