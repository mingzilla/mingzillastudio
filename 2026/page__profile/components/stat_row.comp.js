function StatRow() {
  return html`
    <${Band} tone="light">
      <section className="stat-strip" aria-label="Highlights">
        ${CONTENT.profile.stats.map((s, i) => html`
          <div className="stat" key=${s.label}>
            <strong><${CountUp} value=${s.value} delay=${i * 120} />${s.suffix}</strong>
            <span>${s.label}</span>
          </div>`)}
      </section>
    <//>`;
}
