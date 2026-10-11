function AboutBand({ section }) {
  const p = CONTENT.profile;
  return html`
    <${Band} tone=${section.tone} id=${section.id}>
      <section className="chapter" aria-labelledby="about-h">
        <h2 id="about-h">About</h2>
        <div className="about">${p.about.map((x, i) => html`<p key=${i}><${Rich} text=${x} /></p>`)}</div>
        <div className="focus">${p.focus.map(f => html`
          <${Panel} key=${f.title}><h3>${f.title}</h3><p>${f.text}</p><p className="foot">${f.foot}</p><//>`)}
        </div>
      </section>
    <//>`;
}
