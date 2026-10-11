// Recent apps: one row per app. Simzilla is built for a portrait phone: a gold-framed phone (400px) that plays in place, title and controls beside it.
// Upskill is a desktop-size app: a thin-framed tablet-like poster that opens the prototype in its own page.
// A running game is destroyed with Close, or automatically when scrolled well out of view.
function AppRow({ topic, flip }) {
  const ex = k => { const e = topic.extras.find(e => e.k.startsWith(k)); return e ? e.v : ''; };
  const demo = ex('Demo'), poster = './' + (ex('Image') || ''), repo = ex('Repo'), video = ex('Video');
  const phone = !topic.slug.startsWith('upskill');
  const [playing, setPlaying] = useState(false);
  const ref = useRef(), near = useInView(ref, '500px');
  useEffect(() => { if (!near && playing) setPlaying(false); }, [near]);
  const launch = () => phone ? setPlaying(true) : open(demo, '_blank', 'noopener');
  const screen = playing
    ? html`<iframe src=${demo} title=${topic.title} allow="autoplay; fullscreen" allowFullScreen />`
    : html`<button className="poster" onClick=${launch} aria-label=${(phone ? 'Play ' : 'Open the prototype of ') + topic.title}><img src=${poster} alt=${topic.title + ' screenshot'} loading="lazy" /><span className="badge">${phone ? 'Play' : 'Open the prototype'}</span></button>`;
  return html`
    <article ref=${ref} className=${`app-row ${phone ? 'is-phone' : 'is-wide'}`} id=${topic.slug}>
      <div className="app-media">
        ${phone ? html`<div className="phone-frame"><div className="screen">${screen}</div></div>`
          : html`<div className="tablet-frame"><div className="screen">${screen}</div></div>`}
      </div>
      <div className="app-text">
        <h3>${topic.title}</h3>
        <p className="challenge"><span>Challenge</span> ${topic.challenge}</p>
        ${topic.what.map((x, i) => html`<p className="what" key=${i}>${x}</p>`)}
        <p className="links">
          <button className="btn" onClick=${playing ? () => setPlaying(false) : launch}>${playing ? 'Close' : phone ? 'Play' : 'Open prototype'}</button>
          ${repo ? html`<a className="btn" href=${repo} target="_blank" rel="noreferrer">GitHub</a>` : null}
          ${video ? html`<a className="btn" href=${video} target="_blank" rel="noreferrer">Video</a>` : null}
        </p>
        ${phone ? html`<p className="note">Made for a phone held upright — it works here, on any screen.</p>` : null}
      </div>
    </article>`;
}
function AppsChapter({ section }) {
  const ch = PageSections.chapter(section.chapter);
  const order = ['simzilla', 'upskill'], topics = ch.topics.slice().sort((a, b) => order.findIndex(o => a.slug.startsWith(o)) - order.findIndex(o => b.slug.startsWith(o)));
  return html`
    <${Band} tone=${section.tone} id=${section.id}>
      <section className="chapter" aria-labelledby="apps-h">
        <h2 id="apps-h">${ch.title}</h2>
        ${topics.map(t => html`<${AppRow} key=${t.slug} topic=${t} />`)}
      </section>
    <//>`;
}
