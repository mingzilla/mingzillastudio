// An item as a tab: the definition on top, the state of the raw file in the middle, the state of the summary at the bottom.
// A note day file shows its notes: a consolidated note is read-only, a note after the consolidated mark can be changed.
function ItemTabSectionComp({ title, state, children }) {
    return html`<section className="tab-section"><h3 className="tab-section__title">${title}<span className="tab-section__state">${state}</span></h3>${children}</section>`;
}

function ItemTabNoteComp({ note, onSave }) {
    const area = React.useRef(null);
    if (note.consolidated) return html`<div className="note-block note-block--consolidated"><div className="note-block__head">${note.time}<span className="badge">consolidated</span></div><pre className="content-text">${note.text}</pre></div>`;
    return html`<div className="note-block">
        <div className="note-block__head">${note.time}<span className="badge badge--ready">after the mark</span></div>
        <textarea ref=${area} className="text-area" spellCheck="false" defaultValue=${note.text}></textarea>
        <div className="url-task__tools"><button className="button button--primary" onClick=${() => onSave(area.current.value)}>Save</button></div>
    </div>`;
}

function ItemTabNotesComp({ context, guard, mirror }) {
    const { note } = context.services;
    return html`<div className="tab-body">
        <${ItemTabSectionComp} title="Notes" state=${mirror.noteState}>
            ${guard.item.notes.map((each) => html`<${ItemTabNoteComp} key=${each.id + each.consolidated} note=${each} onSave=${(text) => note.update(guard.item.id, each.id, text)} />`)}
        <//>
    </div>`;
}

function ItemTabComp({ context, tabId }) {
    const guard = useGuard(context, ItemTabGuard, null, { tabId });
    const mirror = React.useMemo(() => (guard ? ItemTabDataMirror.from(guard) : null), [guard]);
    const [stageValues, setStageValues] = React.useState([]);
    if (guard === null) return null;
    if (guard.item === null) return html`<div className="app__placeholder">This item no longer exists.</div>`;
    if (mirror.isNotes) return html`<${ItemTabNotesComp} context=${context} guard=${guard} mirror=${mirror} />`;
    const values = [...new Set([...stageValues, ...mirror.locked])];
    return html`<div className="tab-body">
        <${ItemTabSectionComp} title="Definition" state="meta.json">
            <table className="kv-table"><tbody>${mirror.definition.map(([key, value]) => html`<tr key=${key}><th>${key}</th><td>${value}</td></tr>`)}</tbody></table>
        <//>
        <${ItemTabSectionComp} title="Raw" state=${mirror.rawState}>
            ${mirror.rawText ? html`<pre className="content-text">${mirror.rawText}</pre>` : html`<div className="tree__hint">Nothing yet.</div>`}
        <//>
        <${ItemTabSectionComp} title="Summary" state=${mirror.summaryState}>
            ${mirror.summaryText ? html`<pre className="content-text">${mirror.summaryText}</pre>` : html`<div className="tree__hint">Nothing yet.</div>`}
        <//>
        ${mirror.finished ? null : html`<${StageProceedComp} stageValues=${values} lockedStages=${mirror.locked} canProceed=${StageRules.jobCount(mirror.items, values) > 0} onTick=${(stage, on) => setStageValues(StageRules.ticked(stageValues, stage, on))} onProceed=${() => context.services.task.proceedItem(guard.item.id, values)} />`}
    </div>`;
}
