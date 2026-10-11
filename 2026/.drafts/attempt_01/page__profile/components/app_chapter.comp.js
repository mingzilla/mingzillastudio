// One chapter for one AppCatalog entry.
function AppChapter({ app, no }) {
  const { media } = app;
  const [playing, setPlaying] = useState(false);
  const screen = playing
    ? html`<iframe src=${media.playSrc} title=${app.nav + ' playable demo'} allow="autoplay; fullscreen" allowFullScreen />`
    : html`
      <button className="game-poster" type="button" onClick=${() => media.playSrc ? setPlaying(true) : open(media.href, '_blank')}>
        <img src=${media.poster} alt=${media.alt} />
        <span className="play-badge"><i aria-hidden="true">▶</i>${media.playSrc ? 'Play demo' : 'Open'}</span>
      </button>`;
  return html`
    <${Chapter} id=${app.id} no=${no} title=${app.title}>
      <${Showcase}>
        <div className="copy">
          <h3>${app.headline}</h3>
          <p><b>Challenge:</b></p>
          <p>${app.challenge}</p><br />
          <p><b>What this does:</b></p>
          <p>${app.what}</p>
          <div className="result-strip"><strong>${app.result.strong}</strong><span>${app.result.text}</span></div>
        </div>
        <div className="visual game-panel" aria-label=${app.nav + ' demo'}>
          <div className="pad"><div className="pad-screen">${screen}</div></div>
        </div>
      <//>
    <//>`;
}
