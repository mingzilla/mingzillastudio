function StatStrip() {
  return html`
    <div className="wrap stat-strip">
      ${ProfileStats.all().map((s, i) => html`
        <div className="stat" key=${s.label}>
          <strong className="stat__value"><${CountUp} value=${s.value} delay=${i * 120} />${s.suffix}</strong>
          <span className="stat__label">${s.label}</span>
        </div>`)}
    </div>`;
}
