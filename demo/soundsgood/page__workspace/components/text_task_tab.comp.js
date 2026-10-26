// Save text: a text that the user copied (a lesson, a video, a meeting) becomes the raw file of an item. The group is picked or made; a new group is agreed to.
function TextTaskTabGroupComp({ label, options, groupId, groupName, agreed, onPick, onName, onAgree, newLabel }) {
    const isNew = groupId === null;
    return html`<${FormRowComp} label=${label} action=${isNew ? html`<${CheckBoxComp} label="new: agree" checked=${agreed} onChange=${onAgree} />` : null}>
        <div className="form-row__split">
            <select value=${isNew ? '' : groupId} onChange=${(event) => onPick(event.target.value === '' ? null : Number(event.target.value))}>
                <option value="">${newLabel}</option>
                ${options.map((option) => html`<option key=${option.id} value=${option.id}>${option.title}</option>`)}
            </select>
            ${isNew ? html`<input className="text-input" placeholder="name" value=${groupName} onChange=${(event) => onName(event.target.value)} />` : null}
        </div>
    <//>`;
}

function TextTaskTabComp({ context, tabId }) {
    const guard = useGuard(context, TextTaskTabGuard, null, { tabId });
    const mirror = React.useMemo(() => (guard && guard.entry ? TextTaskTabDataMirror.from(guard) : null), [guard]);
    if (guard === null || guard.entry === null) return null;
    const { task, newTask } = context.services;
    const entry = guard.entry;
    const set = (changes) => task.patchEditor(tabId, changes);
    const input = (field, placeholder = '') => html`<input className="text-input" placeholder=${placeholder} value=${entry[field]} onChange=${(event) => set({ [field]: event.target.value })} />`;
    return html`<div className="tab-body">
        <h2 className="task-tab__title">${mirror.title}</h2>
        <section className="tab-section">
            ${mirror.subject === 'COURSE' ? html`
                <${TextTaskTabGroupComp} label="course" newLabel="new course…" options=${mirror.groupOptions} groupId=${entry.groupId} groupName=${entry.groupName} agreed=${entry.agreed} onPick=${(id) => set({ groupId: id, lessonId: null })} onName=${(name) => set({ groupName: name, agreed: false })} onAgree=${(on) => set({ agreed: on })} />
                <${FormRowComp} label="lesson">
                    <select value=${entry.lessonId === null ? '' : entry.lessonId} onChange=${(event) => set({ lessonId: event.target.value === '' ? null : Number(event.target.value) })}>
                        <option value="">new lesson (at the end of the list)</option>
                        ${mirror.lessonOptions.map((option) => html`<option key=${option.id} value=${option.id}>${option.title}</option>`)}
                    </select>
                <//>
                ${entry.lessonId === null ? html`<${FormRowComp} label="title">${input('title', 'lesson title')}<//>` : null}` : null}
            ${mirror.subject === 'VIDEO' ? html`
                <${FormRowComp} label="URL (optional)" action=${html`<button className="button" disabled=${entry.url.trim() === ''} onClick=${() => newTask.testTextUrl(tabId)}>Test</button>`}>${input('url', 'fills the creator, the title and the date')}<//>
                <${FormRowComp} label="platform"><select value=${entry.platform} onChange=${(event) => set({ platform: event.target.value, groupId: null })}><option value="VIDEOS_YOUTUBE">YouTube</option><option value="VIDEOS_BILIBILI">Bilibili</option></select><//>
                <${TextTaskTabGroupComp} label="creator" newLabel="new creator…" options=${mirror.groupOptions} groupId=${entry.groupId} groupName=${entry.groupName} agreed=${entry.agreed} onPick=${(id) => set({ groupId: id })} onName=${(name) => set({ groupName: name, agreed: false })} onAgree=${(on) => set({ agreed: on })} />
                <${FormRowComp} label="title">${input('title', 'video title')}<//>
                <${FormRowComp} label="date">${input('date', 'yyyymmdd')}<//>` : null}
            ${mirror.subject === 'MEETING' ? html`
                <${FormRowComp} label="title">${input('title', 'meeting title')}<//>
                <${FormRowComp} label="date">${input('date', 'yyyymmdd')}<//>
                <${FormRowComp} label="time">${input('time', 'hhmmss')}<//>` : null}
        </section>
        <section className="tab-section tab-section--fill">
            <h3 className="tab-section__title">Text<span className="tab-section__state">${mirror.subject === 'MEETING' ? 'corrected with voice_typos.md' : 'becomes the raw file'}</span></h3>
            <textarea className="text-area text-area--fill" spellCheck="false" placeholder="Paste the text." value=${entry.text} onChange=${(event) => set({ text: event.target.value })}></textarea>
        </section>
        <div className="stage-proceed">
            <${CheckBoxComp} label="summarise" checked=${entry.stageValues.includes('SUMMARISE')} onChange=${(on) => set({ stageValues: on ? ['SUMMARISE'] : [] })} />
            <button className="button button--primary" disabled=${!mirror.canProceed} onClick=${() => newTask.proceedText(tabId)}>Proceed</button>
        </div>
    </div>`;
}
