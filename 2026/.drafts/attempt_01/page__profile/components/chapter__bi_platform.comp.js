function ChapterBiPlatform() {
  return html`<section className="legacy" id="bi-platform">
    <div className="wrap">
      <header className="chapter-head inverse"><span className="chapter-no">2014—2025</span><h2>Embedded BI Platform (2014-2025)</h2></header>
      <p className="legacy-lead">Spent 11 years as a principal implementation authority for Panintelligence's multi-tenanted BI platform (<b>PowerBI equivalent</b>), architecting and implementing approximately 60% of the system across frontend and backend.</p>

      <ul className="feature-grid">
        <li>Multi-Tenanted Security Control</li>
        <li>Supports +15 Data Connections</li>
        <li>Data Connection Management</li>
        <li>Layout Control</li>
        <li>Report Generation</li>
      </ul>

      <div className="product-shell" aria-label="Stylised embedded BI product showcase">
        <div className="product-top"><span className="product-mark">pi</span><span>Dashboard</span><span className="product-actions">•••</span></div>
        <div className="product-body">
          <nav className="product-nav"><span className="active">Dashboards</span><span>Reports</span><span>Users</span><span>Roles</span><span>Data</span></nav>
          <div className="product-canvas">
            <div className="kpi"><small>Revenue</small><strong>£2.4m</strong><span>↑ 18%</span></div>
            <div className="fake-chart line-chart"><svg viewBox="0 0 380 160"><polyline points="20,126 70,112 120,118 170,84 220,92 270,54 330,40 360,22"/></svg></div>
            <div className="fake-chart bars"><i style=${{height:'34%'}}></i><i style=${{height:'56%'}}></i><i style=${{height:'44%'}}></i><i style=${{height:'73%'}}></i><i style=${{height:'62%'}}></i><i style=${{height:'90%'}}></i></div>
            <div className="fake-table"><span>Customer</span><span>Region</span><span>Revenue</span><b>Acme</b><b>North</b><b>£182k</b><b>Northstar</b><b>South</b><b>£149k</b></div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
