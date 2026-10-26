// A task as a tab. The state is on top. While the task has jobs the form is read-only; Edit pauses the task. A task that does not run shows its current state: stages that are done are ticked and locked.
function TaskTabComp({ context, tabId }) {
    const guard = useGuard(context, TaskTabGuard, null, { tabId });
    const mirror = React.useMemo(() => (guard && guard.task ? TaskTabDataMirror.from(guard) : null), [guard]);
    const [confirming, setConfirming] = React.useState(null);
    if (guard === null) return null;
    if (guard.task === null) return html`<div className="app__placeholder">This task no longer exists.</div>`;
    const { task } = context.services;
    const act = (action) => {
        const run = () => (action === 'edit' ? task.edit(guard.task.id) : task.pause(guard.task.id));
        if (mirror.warning.running > 0) setConfirming({ action, run });
        else run();
    };
    const values = mirror.stageValues;
    return html`<div className="tab-body">
        <div className="task-tab__head">
            <h2 className="task-tab__title">${guard.task.name}</h2>
            <span className=${`badge badge--${mirror.state.toLowerCase()}`}>${mirror.stateLabel}</span>
            <span className="task-row__count">${mirror.itemsLeft} item(s) left</span>
            ${mirror.state === 'RUNNING' ? html`<button className="button" onClick=${() => act('pause')}>Pause</button><button className="button" onClick=${() => act('edit')}>Edit</button>` : null}
        </div>
        <section className="tab-section">
            <h3 className="tab-section__title">Items<span className="tab-section__state">${mirror.items.length}</span></h3>
            <table className="kv-table"><tbody>${mirror.items.map((item) => html`<tr key=${item.id}><th>${item.state}</th><td>${item.name}</td></tr>`)}</tbody></table>
        </section>
        ${mirror.state === 'DONE' ? null : mirror.state === 'RUNNING'
            ? html`<div className="tree__hint">The jobs are in the jobs column. The form is read-only while the task has jobs.</div>`
            : mirror.isConsolidate
                ? html`<div className="stage-proceed"><button className="button button--primary" disabled=${mirror.itemsLeft === 0} onClick=${() => task.resume(guard.task.id, ['CONSOLIDATE'])}>Proceed</button></div>`
                : html`<${StageProceedComp} stageValues=${values} lockedStages=${mirror.locked} canProceed=${mirror.canProceed} onTick=${(stage, on) => task.setStage(tabId, stage, on)} onProceed=${() => task.resume(guard.task.id, values)} />`}
        ${confirming ? html`<${PauseConfirmDialogComp} text=${TaskState.pauseText(mirror.warning)} actionLabel=${confirming.action === 'edit' ? 'Edit' : 'Pause'} onConfirm=${() => { confirming.run(); setConfirming(null); }} onCancel=${() => setConfirming(null)} />` : null}
    </div>`;
}
