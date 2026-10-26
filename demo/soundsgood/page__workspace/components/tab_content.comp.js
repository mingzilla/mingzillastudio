// Picks the tab block from the kind of the active tab. It draws nothing itself.
function TabContentComp({ context }) {
    const guard = useGuard(context, TabContentGuard, null, {});
    if (guard === null) return null;
    const tabId = guard.activeTabId;
    if (!guard.openTabIds.includes(tabId)) return html`<div className="app__placeholder">Open a tab, or choose Create Task.</div>`;
    const kind = TabId.kindOf(tabId);
    const props = { context, tabId, key: tabId };
    if (kind === 'ITEM') return html`<${ItemTabComp} ...${props} />`;
    if (kind === 'TASK') return html`<${TaskTabComp} ...${props} />`;
    if (kind === 'NEW_TASK') {
        const mode = NewTaskKind.of(TabId.newTaskKindOf(tabId)).mode;
        if (mode === 'TEXT') return html`<${TextTaskTabComp} ...${props} />`;
        if (mode === 'AUDIO') return html`<${MeetingAudioTaskTabComp} ...${props} />`;
        return html`<${UrlTaskTabComp} ...${props} />`;
    }
    if (kind === 'NEW_NOTE') return html`<${NoteTabComp} ...${props} />`;
    if (kind === 'TOPIC') return html`<${TopicTabComp} ...${props} />`;
    if (kind === 'VOICE_TYPOS') return html`<${VoiceTyposTabComp} ...${props} />`;
    return html`<${SettingsTabComp} ...${props} />`;
}
