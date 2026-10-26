function SettingsTabComp({ context }) {
    const guard = useGuard(context, SettingsTabGuard, null, {});
    if (guard === null) return null;
    const { settings } = context.services;
    return html`<div className="tab-body">
        <h2 className="task-tab__title">Settings</h2>
        <div className="form--fill">
            <${FormRowComp} label="summary jobs"><select value=${guard.summaryLaneCapacity} onChange=${(event) => settings.patch({ summaryLaneCapacity: Number(event.target.value) })}>${[1, 2, 3, 4, 5].map((n) => html`<option key=${n} value=${n}>${n} at a time</option>`)}</select><//>
            <${FormRowComp} label="transcript jobs"><span>1 at a time (fixed: the GPU and the browser)</span><//>
            <${FormRowComp} label="summary prompt"><select value=${guard.promptFile} onChange=${(event) => settings.patch({ promptFile: event.target.value })}>${['_prompts/summary__course.md', '_prompts/summary__meeting.md', '_prompts/summary__video.md'].map((file) => html`<option key=${file} value=${file}>${file}</option>`)}</select><//>
            <${FormRowComp} label="data folder"><span>code__app_data/soundsgood/mingzilla</span><//>
        </div>
    </div>`;
}
