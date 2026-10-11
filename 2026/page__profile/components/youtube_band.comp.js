function YoutubeBand({ section }) {
  const yt = CONTENT.profile.connect[0], others = CONTENT.profile.connect.slice(1);
  return html`
    <${Band} tone=${section.tone} id=${section.id}>
      <section className="chapter" aria-labelledby="yt-h">
        <h2 id="yt-h">Videos</h2>
        <${Panel} label="YouTube">
          <div className="yt">
            <a className="yt-img" href=${yt.url} target="_blank" rel="noreferrer"><img src=${yt.image} alt="MingzillaStudio YouTube channel" loading="lazy" /></a>
            <div>
              <h3>MingzillaStudio</h3>
              <p>Videos on AI engineering: agent teams, skills and LLM systems at scale.</p>
              <p><a className="btn" href=${yt.url} target="_blank" rel="noreferrer">Watch on YouTube</a></p>
            </div>
          </div>
        <//>
        <ul className="connect">${others.map(o => html`<li key=${o.name}><a href=${o.url} target="_blank" rel="noreferrer">${o.name}</a></li>`)}</ul>
      </section>
    <//>`;
}
