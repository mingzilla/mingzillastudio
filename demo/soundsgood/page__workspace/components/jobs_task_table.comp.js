// One table for each running task: the task is the header row (name, counts, Pause, Edit), the jobs are the body rows.
// The right of every row is the same: the label (right aligned; the reason is its title), button 1, button 2. A button that is absent keeps its place, so everything lines up.
// A header row is dragged to change which task runs next.
class JobsDrag {
    static current = null; // a dragover cannot read the data transfer
}

function JobsTaskTableJobRowComp({ row, onCancel, onRetry }) {
    return html`<tr className="jobs-table__job">
        <td>${row.display.state === 'RUNNING' ? html`<${JobDotComp} kind="running" title="running: this is the blue part of the overview" />` : null}</td>
        <td><${StageTagComp} stage=${row.stage} /></td>
        <td className="jobs-table__item" title=${row.itemName}>${row.itemName}</td>
        <td className="jobs-table__state"><span className=${`badge badge--${row.display.state.toLowerCase()}`} title=${row.display.reason || ''}>${JobState.of(row.display.state).label}</span></td>
        <td>${row.actions.includes('retry') ? html`<button className="button button--small jobs-table__button" onClick=${() => onRetry([row.id])}>retry</button>` : null}</td>
        <td>${row.actions.includes('cancel') ? html`<button className="button button--small jobs-table__button" onClick=${() => onCancel(row.id)}>cancel</button>` : null}</td>
    </tr>`;
}

function JobsTaskTableComp({ table, onAct, onOpen, onCancel, onRetry, onMove }) {
    const over = (event) => {
        if (JobsDrag.current !== null) event.preventDefault();
    };
    const drop = (event) => {
        if (JobsDrag.current === null) return;
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        onMove(JobsDrag.current, table.id, event.clientY > rect.top + rect.height / 2);
        JobsDrag.current = null;
    };
    return html`<table className="jobs-table">
        <colgroup><col className="jobs-table__dot-col" /><col className="jobs-table__stage-col" /><col /><col className="jobs-table__state-col" /><col className="jobs-table__button-col" /><col className="jobs-table__button-col" /></colgroup>
        <thead><tr className="jobs-table__head" draggable=${table.showActions} onDragStart=${() => { JobsDrag.current = table.id; }} onDragOver=${over} onDrop=${drop}>
            <th colSpan="4"><button className="task-row__name" title="Open the task" onClick=${() => onOpen(table.id)}>${table.name} (${table.total})</button><span className="jobs-table__counts">${table.countsText}</span></th>
            <th>${table.showActions ? html`<button className="button button--small jobs-table__button" onClick=${() => onAct(table, 'pause')}>pause</button>` : null}</th>
            <th>${table.showActions && table.canEdit ? html`<button className="button button--small jobs-table__button" onClick=${() => onAct(table, 'edit')}>edit</button>` : null}</th>
        </tr></thead>
        <tbody>
            ${table.rows.map((row) => html`<${JobsTaskTableJobRowComp} key=${row.id} row=${row} onCancel=${onCancel} onRetry=${onRetry} />`)}
            ${table.more > 0 ? html`<tr><td colSpan="6" className="jobs-table__more">+ ${table.more} more</td></tr>` : null}
        </tbody>
    </table>`;
}
