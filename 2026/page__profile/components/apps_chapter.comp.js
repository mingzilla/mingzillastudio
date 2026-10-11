// Recent apps: each app is a poster you click to play / try. Upskill's prototype is desktop-only: on a phone it opens in a tab.
function AppCard({ topic }) {
  const ex = k => { const e = topic.extras.find(e => e.k.startsWith(k)); return e ? e.v : ''; };
  const demo = ex('Demo'), poster = './' + (ex('Image') || ''), repo = ex('Repo'), video = ex('Video');
  const [playing, setPlaying] = useState(false);
  const desktopOnly = topic.slug.startsWith('upskill');
  const play = () => { if (desktopOnly && innerWidth < 900) open(demo, '_blank', 'noopener'); else setPlaying(true); };
  return html`
    <article className="app" id=${topic.slug}>
      <h3>${topic.title}</h3>
      <p className="challenge"><span>Challenge</span> ${topic.challenge}</p>
      ${topic.what.map((x, i) => html`<p className="what" key=${i}>${x}</p>`)}
      ${ex('Result') ? html`<p className="result"><${Rich} text=${ex('Result')} /></p>` : null}
      <${Panel} label=${desktopOnly ? 'interactive prototype' : 'playable demo'}>
        <div className=${`demo ${desktopOnly ? 'wide' : 'phone'}`}>
          ${playing ? html`<iframe src=${demo} title=${topic.title} allow="autoplay; fullscreen" allowFullScreen />`
            : html`<button className="poster" onClick=${play} aria-label=${'Open ' + topic.title}><img src=${poster} alt=${topic.title + ' screenshot'} loading="lazy" /><span className="badge">${desktopOnly ? 'Try the prototype' : 'Play demo'}</span></button>`}
        </div>
        <p className="links">
          <button className="btn" onClick=${play}>${desktopOnly ? 'Try prototype' : 'Play'}</button>
          ${repo ? html`<a className="btn" href=${repo} target="_blank" rel="noreferrer">GitHub</a>` : null}
          ${video ? html`<a className="btn" href=${video} target="_blank" rel="noreferrer">Video</a>` : null}
        </p>
      <//>
    </article>`;
}
function AppsChapter({ section }) {
  const ch = PageSections.chapter(section.chapter);
  return html`
    <${Band} tone=${section.tone} id=${section.id}>
      <section className="chapter" aria-labelledby="apps-h">
        <h2 id="apps-h">${ch.title}</h2>
        <div className="apps">${ch.topics.map(t => html`<${AppCard} key=${t.slug} topic=${t} />`)}</div>
      </section>
    <//>`;
}
