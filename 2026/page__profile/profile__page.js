function ProfilePage() {
  const sections = PageSections.all(), nodes = HeroMap.nodes();
  const spy = useScrollSpy(sections.map(s => s.id));
  const kinds = { apps: AppsChapter, chapter: Chapter, bi: BiChapter, about: AboutBand, youtube: YoutubeBand };
  const dots = nodes.map(n => ({ id: n.id, x: n.ax * 100, y: n.ay * 100, section: n.section, app: n.kind === 'app', me: n.kind === 'me', target: n.target, label: n.label }));
  const cur = sections.find(s => s.id === spy.active);
  const yt = CONTENT.profile.connect[0];
  return html`
    <${TopNav} links=${sections.filter(s => s.nav).map(s => ({ id: s.id, label: s.nav }))} cta=${{ label: 'YouTube', href: yt.url }} />
    <${Hero} />
    <${StatRow} />
    <main>${sections.map(s => { const C = kinds[s.kind]; return html`<${C} key=${s.id} section=${s} />`; })}</main>
    <${PageFooter} />
    <${MiniMap} dots=${dots} active=${spy.active} label=${cur && cur.nav ? cur.nav : 'Ming Huang'} onJump=${scrollToId} />`;
}
