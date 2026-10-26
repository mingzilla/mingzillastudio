// `| unresolved | resolved |`: the views inside a tab.
function ViewSwitchComp({ views, activeId, onPick }) {
    return html`<div className="view-switch" role="tablist">
        ${views.map((view) => html`<button key=${view.id} role="tab" className=${view.id === activeId ? 'view-switch__view view-switch__view--active' : 'view-switch__view'} onClick=${() => onPick(view.id)}>${view.label}${view.count !== undefined ? html` <span className="view-switch__count">${view.count}</span>` : null}</button>`)}
    </div>`;
}
