// Download playlist / download item: Test fetches the data of the URLs; the plan maps each item to a group; Proceed adds the entries to meta.json. Auto skips the question.
function UrlTaskTabGroupsComp({ groups, onAgree, onRename }) {
    return html`<table className="plan-table">
        <thead><tr><th>group</th><th>items</th><th></th></tr></thead>
        <tbody>${groups.map((group) => html`<tr key=${group.shape + group.name}>
            <td><input className="text-input text-input--table" defaultValue=${group.name} onBlur=${(event) => event.target.value !== group.name && onRename(group, event.target.value)} /></td>
            <td>${group.count}</td>
            <td>${group.isNew ? html`<${CheckBoxComp} label="new group: agree" checked=${group.agreed} onChange=${(on) => onAgree(group, on)} />` : html`<span className="plan-table__reason">exists</span>`}</td>
        </tr>`)}</tbody>
    </table>`;
}

function UrlTaskTabPlanTableComp({ rows, onChange }) {
    return html`<table className="plan-table">
        <thead><tr><th>URL</th><th>title</th><th>goes to</th><th>action</th></tr></thead>
        <tbody>${rows.map((row) => html`<tr key=${row.id} className=${row.action === 'SKIP' ? 'plan-table__row plan-table__row--skip' : 'plan-table__row'}>
            <td className="plan-table__url" title=${row.url}>${row.url}</td>
            <td>${row.title}</td>
            <td>${row.goesTo}</td>
            <td><select value=${row.action} onChange=${(event) => onChange(row.id, { action: event.target.value })}><option value="ADD">add</option><option value="SKIP">skip</option></select>${row.reason ? html` <span className="plan-table__reason">${row.reason}</span>` : null}</td>
        </tr>`)}</tbody>
    </table>`;
}

function UrlTaskTabComp({ context, tabId }) {
    const guard = useGuard(context, UrlTaskTabGuard, null, { tabId });
    const mirror = React.useMemo(() => (guard && guard.entry ? UrlTaskTabDataMirror.from(guard) : null), [guard]);
    if (guard === null || guard.entry === null) return null;
    const { task, newTask } = context.services;
    const entry = guard.entry;
    const change = (rows) => newTask.setPlanRows(tabId, rows);
    return html`<div className="tab-body">
        <h2 className="task-tab__title">${mirror.title}</h2>
        <section className="tab-section">
            <h3 className="tab-section__title">${mirror.urlTitle}<span className="tab-section__state">${mirror.urlHint} · ${mirror.urlCount} found</span></h3>
            <textarea className="text-area" spellCheck="false" placeholder="https://..." value=${entry.urlText} onChange=${(event) => task.patchEditor(tabId, { urlText: event.target.value, tested: false, planRows: [], warnings: [] })}></textarea>
            <div className="url-task__tools">
                <button className="button" disabled=${!mirror.canTest} onClick=${() => newTask.testUrls(tabId)}>${entry.testing ? 'Testing…' : 'Test'}</button>
                <${CheckBoxComp} label="Auto" title="Do not ask: use the mapping rules" checked=${entry.auto} onChange=${(on) => task.patchEditor(tabId, { auto: on })} />
            </div>
            ${entry.warnings.map((warning) => html`<div key=${warning} className="tree__hint tree__hint--warn">${warning}</div>`)}
        </section>
        ${entry.tested ? html`<section className="tab-section">
            <h3 className="tab-section__title">Plan<span className="tab-section__state">${mirror.groups.length} group(s) · ${mirror.addCount} item(s) to add</span></h3>
            <${UrlTaskTabGroupsComp} groups=${mirror.groups} onAgree=${(group, on) => change(PlanTable.agreeGroup(entry.planRows, group.shape, group.name, on))} onRename=${(group, name) => change(PlanTable.renameGroup(entry.planRows, group.shape, group.name, name, mirror.existingGroups))} />
            <${UrlTaskTabPlanTableComp} rows=${entry.planRows} onChange=${(rowId, changes) => change(PlanTable.withRow(entry.planRows, rowId, changes))} />
        </section>` : null}
        <${StageProceedComp} stageValues=${entry.stageValues} canProceed=${mirror.canProceed} onTick=${(stage, on) => task.setStage(tabId, stage, on)} onProceed=${() => newTask.proceedUrls(tabId)} />
    </div>`;
}
