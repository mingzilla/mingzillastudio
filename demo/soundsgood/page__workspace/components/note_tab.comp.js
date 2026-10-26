// Save notes: a big text area and Save. The text is added to the day file of today as a new note. It is not a task.
function NoteTabComp({ context, tabId }) {
    const guard = useGuard(context, NoteTabGuard, null, { tabId });
    if (guard === null || guard.entry === null) return null;
    const { note, task } = context.services;
    return html`<div className="tab-body">
        <section className="tab-section tab-section--fill">
            <h3 className="tab-section__title">Save notes<span className="tab-section__state">added to today's day file</span></h3>
            <textarea className="text-area text-area--fill" spellCheck="false" placeholder="Paste or type. Many topics are fine." value=${guard.entry.noteText} onChange=${(event) => task.patchEditor(tabId, { noteText: event.target.value })}></textarea>
        </section>
        <div className="stage-proceed"><button className="button button--primary" disabled=${guard.entry.noteText.trim() === ''} onClick=${() => note.save(tabId, guard.entry.noteText)}>Save</button></div>
    </div>`;
}
