// The top bar: what the lists show, the pop-up that makes tasks, and the jobs column. The tab strip holds tabs only.
function TopBarComp({ context }) {
    const guard = useGuard(context, TopBarGuard, null, {});
    const mirror = React.useMemo(() => (guard ? TopBarDataMirror.from(guard) : null), [guard]);
    if (guard === null) return null;
    const { navigation } = context.services;
    return html`<div className="top-bar">
        <span className="top-bar__label">CONTENT</span>
        <${SegmentedComp} options=${mirror.contentOptions} activeId=${guard.content} onPick=${(id) => navigation.setContent(id)} />
        <span className="top-bar__divider"></span>
        <button className="top-bar__button" title="Make a task" onClick=${() => navigation.openCreateTask()}>${Icons.of('plus')}<span>Create Task</span>${mirror.inboxDot ? html`<span className="top-bar__dot" title="Files wait in the inbox"></span>` : null}</button>
        <span className="top-bar__divider"></span>
        <button className=${mirror.jobsOpen ? 'top-bar__button top-bar__button--active' : 'top-bar__button'} title="Open or close the jobs column" onClick=${() => navigation.toggleColumn('jobs')}>${WorkspaceIcons.of('jobs')}<span>Jobs (${mirror.jobCount})</span>${mirror.attention ? html`<span className="top-bar__dot top-bar__dot--danger" title="A job failed or needs you"></span>` : null}</button>
    </div>`;
}
