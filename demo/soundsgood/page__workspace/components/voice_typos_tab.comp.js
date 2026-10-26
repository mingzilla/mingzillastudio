// Voice typos: the proposals of the app, to approve or reject; and the resolved ones, to edit or remove.
// Both views have the same columns and the same widths, so nothing moves when the user changes the view: heard, should be, context, and two fixed columns at the right (approve / approved, reject / remove).
function VoiceTyposTabRowComp({ typo, resolved, actions }) {
    return html`<tr>
        <td className="typos__wrong" title=${typo.wrong}>${typo.wrong}</td>
        <td><input className="text-input text-input--table" defaultValue=${typo.suggested} onBlur=${(event) => resolved ? (typo.state === 'APPROVED' ? actions.edit(typo.id, event.target.value) : null) : actions.approve(typo.id, event.target.value)} disabled=${resolved && typo.state === 'REJECTED'} /></td>
        <td className="typos__context" title=${typo.context}>${typo.context}</td>
        <td>${resolved
            ? html`<span className=${`badge typos__button typos__state badge--${typo.state === 'APPROVED' ? 'done' : 'cancelled'}`}>${typo.state.toLowerCase()}</span>`
            : html`<button className="button button--small button--primary typos__button" onClick=${(event) => actions.approve(typo.id, event.currentTarget.closest('tr').querySelector('input').value)}>approve</button>`}</td>
        <td>${resolved
            ? html`<button className="button button--small typos__button" onClick=${() => actions.remove(typo)}>remove</button>`
            : html`<button className="button button--small typos__button" onClick=${() => actions.reject(typo.id)}>reject</button>`}</td>
    </tr>`;
}

function VoiceTyposTabComp({ context }) {
    const guard = useGuard(context, VoiceTyposTabGuard, null, {});
    const [view, setView] = React.useState('unresolved');
    const mirror = React.useMemo(() => (guard ? VoiceTyposTabDataMirror.from(guard, view) : null), [guard, view]);
    if (guard === null) return null;
    const { voiceTypo } = context.services;
    return html`<div className="tab-body">
        <h2 className="task-tab__title">Voice typos</h2>
        <${ViewSwitchComp} views=${mirror.views} activeId=${view} onPick=${setView} />
        ${mirror.rows.length === 0 ? html`<div className="tree__hint">Nothing here.</div>` : html`<table className="typos-table">
            <colgroup><col className="typos__col-text" /><col className="typos__col-text" /><col /><col className="typos__col-action" /><col className="typos__col-action" /></colgroup>
            <thead><tr><th>heard</th><th>should be</th><th>context</th><th colSpan="2"></th></tr></thead>
            <tbody>${mirror.rows.map((typo) => html`<${VoiceTyposTabRowComp} key=${typo.id + typo.state} typo=${typo} resolved=${view === 'resolved'} actions=${voiceTypo} />`)}</tbody>
        </table>`}
    </div>`;
}
