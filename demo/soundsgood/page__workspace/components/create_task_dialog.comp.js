// The one entry that makes a task tab. Every row starts with `save text`. The Note row is capture: it saves at once and makes no task.
function CreateTaskDialogComp({ context }) {
    const guard = useGuard(context, CreateTaskDialogGuard, null, {});
    const mirror = React.useMemo(() => (guard ? CreateTaskDialogDataMirror.from(guard) : null), [guard]);
    if (guard === null || !guard.open) return null;
    const { navigation } = context.services;
    const pick = (cell) => (cell.kind === 'NEW_NOTE' ? navigation.openNewNote() : navigation.openNewTask(cell.kind));
    return html`<${DialogComp} title="Create Task" wide=${true} onClose=${() => navigation.closeCreateTask()}>
        <div className="create-task">
            ${mirror.rows.map((row) => html`<div key=${row.label} className="create-task__row">
                <span className="create-task__label">${WorkspaceIcons.of(row.icon)}${row.label}</span>
                ${row.cells.map((cell, index) => (cell === null ? html`<span key=${index}></span>` : html`<button key=${cell.kind} className="button create-task__cell" style=${cell.span ? { gridColumn: `span ${cell.span}` } : undefined} disabled=${cell.disabled} title=${cell.title} onClick=${() => pick(cell)}>${cell.label}</button>`))}
            </div>`)}
        </div>
    <//>`;
}
