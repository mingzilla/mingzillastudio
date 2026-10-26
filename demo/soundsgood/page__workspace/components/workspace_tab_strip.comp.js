// The strip holds the tabs only. It is always visible.
function WorkspaceTabStripComp({ context }) {
    const guard = useGuard(context, WorkspaceTabStripGuard, null, {});
    const mirror = React.useMemo(() => (guard ? WorkspaceTabStripDataMirror.from(guard) : null), [guard]);
    if (guard === null) return null;
    const { navigation } = context.services;
    const menu = (tabId, action) => {
        if (action === 'close') navigation.closeTab(tabId);
        if (action === 'others') navigation.closeOthers(tabId);
        if (action === 'left') navigation.closeLeft(tabId);
        if (action === 'right') navigation.closeRight(tabId);
    };
    return html`<div className="workspace-strip">
        <div className="workspace-strip__tabs"><${TabStripComp} tabs=${mirror.tabs} onSelect=${(id) => navigation.openTab(id)} onClose=${(id) => navigation.closeTab(id)} onPickMenu=${menu} /></div>
    </div>`;
}
