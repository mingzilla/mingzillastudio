function Hero() {
  const p = CONTENT.profile;
  return html`
    <${Band} tone="dark" extra="hero-band" id="top">
      <header className="hero">
        <${Panel} keepDark=${true} label="Ming Huang">
          <h1>${p.hero.title}</h1>
          <p className="sub"><${Rich} text=${p.hero.sub} /></p>
        <//>
        <${WidgetPanel} keepDark=${true} label="the work — hover for the challenge, click to jump" widget="map" minHeight=${300} props=${{ data: { nodes: HeroMap.nodes() }, onSelect: n => scrollToId(n.target) }} />
      </header>
    <//>`;
}
