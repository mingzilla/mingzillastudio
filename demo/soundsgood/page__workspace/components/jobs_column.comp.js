// The jobs column: the overview, a table for each running task, the tasks that do not run. Show Failed replaces them with the list of failed jobs.
function JobsColumnComp({ context }) {
    const guard = useGuard(context, JobsColumnGuard, null, {});
    const mirror = React.useMemo(() => (guard ? JobsColumnDataMirror.from(guard) : null), [guard]);
    const [showFailed, setShowFailed] = React.useState(false);
    const [confirming, setConfirming] = React.useState(null);
    if (guard === null) return null;
    const { navigation, task } = context.services;
    const openTask = (id) => navigation.openTab(TabId.task(id));
    const act = (table, action) => {
        const run = () => (action === 'edit' ? task.edit(table.id) : task.pause(table.id));
        if (table.warning.running > 0) setConfirming({ action, text: TaskState.pauseText(table.warning), run });
        else run();
    };
    return html`<aside className="side jobs-column">
        <div className="side__header">
            <span className="side__title">${WorkspaceIcons.of('jobs')} Jobs</span>
            <span className="side-section__actions">
                <button className=${showFailed ? 'button button--small button--primary' : 'button button--small'} disabled=${mirror.failedCount === 0 && !showFailed} onClick=${() => setShowFailed(!showFailed)}>Show Failed (${mirror.failedCount})</button>
                <button className="side-section__button" title="Close" onClick=${() => navigation.toggleColumn('jobs')}>${Icons.of('close')}</button>
            </span>
        </div>
        <div className="tree jobs-column__body">
            ${showFailed
                ? html`<${JobsFailedListComp} tables=${mirror.failedTables} count=${mirror.failedCount} onOpen=${openTask} onRetry=${(ids) => task.retry(ids)} onCancel=${(id) => task.cancelJob(id)} />`
                : html`<${JobsOverviewComp} idle=${mirror.idle} lanes=${mirror.lanes} overall=${mirror.overall} failedCount=${mirror.failedCount} needsYouCount=${mirror.needsYouCount} />
                    ${mirror.tables.length === 0 ? null : html`<section>
                        <h3 className="jobs-section__title">Running tasks</h3>
                        ${mirror.tables.map((table) => html`<${JobsTaskTableComp} key=${table.id} table=${table} onAct=${act} onOpen=${openTask} onCancel=${(id) => task.cancelJob(id)} onRetry=${(ids) => task.retry(ids)} onMove=${(from, to, after) => task.reorderTasks(from, to, after)} />`)}
                    </section>`}
                    <${JobsNotRunningComp} tasks=${mirror.notRunning} onOpen=${openTask} />`}
        </div>
        ${confirming ? html`<${PauseConfirmDialogComp} text=${confirming.text} actionLabel=${confirming.action === 'edit' ? 'Edit' : 'Pause'} onConfirm=${() => { confirming.run(); setConfirming(null); }} onCancel=${() => setConfirming(null)} />` : null}
    </aside>`;
}
