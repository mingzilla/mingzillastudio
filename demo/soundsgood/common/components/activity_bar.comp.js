function ActivityBarComp({ items, bottomItems = [], onPick }) {
    const button = (item) => html`<button key=${item.id} className=${item.active ? 'activity-bar__item activity-bar__item--active' : 'activity-bar__item'} title=${item.label} onClick=${() => onPick(item.id)}>${item.icon}${item.badge ? html`<span className="activity-bar__badge">${item.badge}</span>` : null}</button>`;
    return html`<nav className="activity-bar">
        ${items.map(button)}
        <div className="activity-bar__bottom">${bottomItems.map(button)}</div>
    </nav>`;
}
