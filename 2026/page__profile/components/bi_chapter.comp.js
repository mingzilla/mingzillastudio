function BiChapter({ section }) {
  const bi = CONTENT.profile.bi;
  return html`
    <${Band} tone=${section.tone} id=${section.id}>
      <section className="chapter" aria-labelledby="bi-h">
        <h2 id="bi-h">${bi.title}</h2>
        <p className="lead"><${Rich} text=${bi.lead} /></p>
        <div className="arch">${bi.architecture.map(a => html`
          <div key=${a.side}><h3>${a.side}</h3><ul>${a.points.map(x => html`<li key=${x}>${x}</li>`)}</ul></div>`)}</div>
        <${WidgetPanel} label="multi-level permissions — pick a user and see what they can see" widget="permissions" bandTone=${section.tone} />
        <${WidgetPanel} label="change detection — the same data change, redrawing everything vs only what changed" widget="changes" bandTone=${section.tone} />
        <ul className="chips">${bi.features.map(f => html`<li key=${f}>${f}</li>`)}</ul>
      </section>
    <//>`;
}
