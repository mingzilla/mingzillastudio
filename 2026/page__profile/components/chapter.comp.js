function Chapter({ section }) {
  const ch = PageSections.chapter(section.chapter);
  return html`
    <${Band} tone=${section.tone} id=${section.id}>
      <section className="chapter" aria-labelledby=${section.id + '-h'}>
        <h2 id=${section.id + '-h'}>${ch.title.replace(/ \(.*\)$/, '')}</h2>
        ${ch.topics.map(t => html`<${Topic} key=${t.slug} topic=${t} tone=${section.tone} />`)}
      </section>
    <//>`;
}
