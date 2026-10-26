// Convert audio to text: the media files of the inbox are meetings. Nothing starts before Proceed.
function MeetingAudioTaskTabComp({ context, tabId }) {
    const guard = useGuard(context, MeetingAudioTaskTabGuard, null, { tabId });
    const mirror = React.useMemo(() => (guard && guard.entry ? MeetingAudioTaskTabDataMirror.from(guard) : null), [guard]);
    if (guard === null || guard.entry === null) return null;
    const { task, newTask } = context.services;
    const tick = (ids) => task.patchEditor(tabId, { inboxTickedIds: ids });
    const ticked = guard.entry.inboxTickedIds;
    return html`<div className="tab-body">
        <h2 className="task-tab__title">Convert audio to text <span className="badge">${mirror.rows.length} file(s)</span></h2>
        ${mirror.rows.length === 0 ? html`<div className="tree__hint">The inbox is empty.</div>` : html`<table className="plan-table">
            <thead><tr><th><${CheckBoxComp} label="" checked=${mirror.allTicked} onChange=${(on) => tick(on ? mirror.rows.map((row) => row.id) : [])} /></th><th>file</th><th>date</th><th>goes to month</th><th>size</th></tr></thead>
            <tbody>${mirror.rows.map((row) => html`<tr key=${row.id}><td><${CheckBoxComp} label="" checked=${row.ticked} onChange=${(on) => tick(on ? [...ticked, row.id] : ticked.filter((id) => id !== row.id))} /></td><td>${row.name}</td><td>${row.date}</td><td>meetings / ${row.month}</td><td>${row.sizeMb} MB</td></tr>`)}</tbody>
        </table>`}
        <${StageProceedComp} stageValues=${guard.entry.stageValues} canProceed=${mirror.canProceed} onTick=${(stage, on) => task.setStage(tabId, stage, on)} onProceed=${() => newTask.proceedAudio(tabId)} />
    </div>`;
}
