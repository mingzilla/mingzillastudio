// The page: three columns. A column drag sends commands through the bridge; only this component hears them.
function WorkspacePageComp({ context }) {
    const guard = useGuard(context, WorkspacePageGuard, null, {});
    const [live, setLive] = React.useState({});
    React.useEffect(() => {
        const subscription = WorkspacePageBridges.columnWidth.asObservable().subscribe(({ column, width }) => setLive((previous) => ({ ...previous, [column]: width })));
        return () => subscription.unsubscribe();
    }, []);
    if (guard === null) return null;
    const { layout } = context.services;
    const width = (column) => live[column] ?? guard[`${column}Width`];
    const divider = (column, side) => html`<${ColumnDividerComp} side=${side} onResize=${(px) => layout.live(column, px)} onCommit=${() => layout.commit(column)} onReset=${() => layout.reset(column)} />`;
    return html`<div className="workspace">
        ${guard.listOpen ? html`<div className="workspace__column" style=${{ width: width('list') }}><${ListColumnComp} context=${context} />${divider('list', 'right')}</div>` : null}
        <div className="workspace__main">
            <${WorkspaceTabStripComp} context=${context} />
            <div className="workspace__content"><${TabContentComp} context=${context} /></div>
        </div>
        ${guard.jobsOpen ? html`<div className="workspace__column workspace__column--jobs" style=${{ width: width('jobs') }}>${divider('jobs', 'left')}<${JobsColumnComp} context=${context} /></div>` : null}
    </div>`;
}
