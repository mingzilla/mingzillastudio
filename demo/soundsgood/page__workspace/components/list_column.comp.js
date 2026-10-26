// The list: Unfinished shows the unfinished items under header rows, with ticks and the stage bar. Finished and All show a folder tree, closed at first.
// Notes in Finished and All have the views Daily and Topics.
function ListColumnItemRowComp({ row, tickable, onTick, onOpen }) {
    return html`<div className=${row.ticked ? 'tree__row tree__row--selected list-column__row' : 'tree__row list-column__row'}>
        ${tickable ? html`<input type="checkbox" checked=${row.ticked} onChange=${() => onTick(row.id)} />` : null}
        <span className="list-column__marks" title="meta · raw · summary">
            <${StatusMarkComp} on=${row.marks.meta} title="meta" />
            <${StatusMarkComp} on=${row.marks.raw} title="raw" />
            <${StatusMarkComp} on=${row.marks.summary} title=${row.marks.stale ? 'summary (stale)' : 'summary'} tone=${row.marks.stale ? 'warn' : 'ok'} />
        </span>
        <span className="tree__title" title=${row.summaryLine || row.name} onClick=${() => onOpen(row.id)}>${row.name}</span>
        ${row.dot ? html`<${JobDotComp} kind=${row.dot.kind} title=${row.dot.title} />` : row.detail ? html`<span className="badge" title=${row.detailTitle}>${row.detail}</span>` : null}
    </div>`;
}

function ListColumnGroupHeaderRowComp({ section, onToggle, onTick }) {
    return html`<div className="list-column__group-header">
        <button className="tree__caret" title=${section.open ? 'Close' : 'Open'} onClick=${() => onToggle(section.groupId)}>${section.open ? '▾' : '▸'}</button>
        ${section.tickable ? html`<input type="checkbox" checked=${section.allTicked} onChange=${(event) => onTick(section.itemIds, event.target.checked)} />` : null}
        <span className="list-column__group-title">${section.title}</span>
        <span className="tree__detail">${section.count}</span>
    </div>`;
}

function ListColumnFolderRowComp({ section, onToggle }) {
    return html`<div className="tree__row list-column__folder" onClick=${() => onToggle(section.groupId)}>
        <span className="tree__caret">${section.open ? '▾' : '▸'}</span>
        <span className="tree__icon">${Icons.of('folder')}</span>
        <span className="tree__title">${section.title}</span>
        <span className="tree__detail">${section.count}</span>
    </div>`;
}

function ListColumnFooterComp({ mirror, services }) {
    if (mirror.mode !== 'LIST') return null;
    if (mirror.isNotes) {
        return html`<div className="stage-proceed list-column__footer"><span>${mirror.notesLeft} note(s) after the consolidated mark</span><button className="button button--primary" disabled=${mirror.notesLeft === 0} onClick=${() => services.note.consolidate()}>Consolidate</button></div>`;
    }
    return html`<div className="list-column__footer"><${StageProceedComp} stageValues=${mirror.stageValues} canProceed=${mirror.canProceed} onTick=${(stage, on) => services.selection.setStage(stage, on)} onProceed=${() => services.task.proceedTicked()} /></div>`;
}

function ListColumnComp({ context }) {
    const guard = useGuard(context, ListColumnGuard, null, {});
    const mirror = React.useMemo(() => (guard ? ListColumnDataMirror.from(guard) : null), [guard]);
    if (guard === null) return null;
    const { services } = context;
    const open = (id) => services.navigation.openTab(TabId.item(id));
    const rowsOf = (section) => section.rows.map((row) => html`<${ListColumnItemRowComp} key=${row.id} row=${row} tickable=${section.tickable} onTick=${(id) => services.selection.toggle(id)} onOpen=${open} />`);
    return html`<aside className="side list-column">
        <div className="side__header">
            <span className="side__title">${mirror.title}</span>
            <span className="side-section__actions"><button className="side-section__button" title="Close" onClick=${() => services.navigation.toggleColumn('list')}>${Icons.of('close')}</button></span>
        </div>
        ${mirror.views ? html`<${ViewSwitchComp} views=${mirror.views} activeId=${guard.notesView} onPick=${(view) => services.navigation.setNotesView(view)} />` : null}
        ${mirror.topicViews ? html`<${ViewSwitchComp} views=${mirror.topicViews} activeId=${guard.topicFolder} onPick=${(folder) => services.navigation.setTopicFolder(folder)} />` : null}
        ${mirror.mode === 'LIST' && mirror.tickable ? html`<div className="list-column__tools">
            <button className="button button--small" onClick=${() => services.selection.setMany(mirror.shownIds, true)}>All</button>
            <button className="button button--small" onClick=${() => services.selection.clear()}>None</button>
            <span className="list-column__count">${mirror.tickedCount} ticked</span>
        </div>` : null}
        <div className="tree">
            ${mirror.mode === 'TOPICS'
                ? html`${mirror.topicRows.length === 0 ? html`<div className="tree__hint">No topic.</div>` : null}${mirror.topicRows.map((row) => html`<div key=${row.id} className="tree__row" onClick=${() => services.navigation.openTab(TabId.topic(row.id))}><span className="tree__icon">${Icons.of('file')}</span><span className="tree__title">${row.title}</span></div>`)}`
                : html`${mirror.sections.length === 0 ? html`<div className="tree__hint">${mirror.emptyText}${mirror.offerCreate ? html` <button className="list-column__link" onClick=${() => services.navigation.openCreateTask()}>Create Task</button>` : null}</div>` : null}
                    ${mirror.sections.map((section) => html`<div key=${section.groupId}>
                        ${mirror.mode === 'LIST'
                            ? html`<${ListColumnGroupHeaderRowComp} section=${section} onToggle=${(id) => services.selection.toggleCollapsed(id)} onTick=${(ids, on) => services.selection.setMany(ids, on)} />`
                            : html`<${ListColumnFolderRowComp} section=${section} onToggle=${(id) => services.selection.toggleOpen(id)} />`}
                        ${section.open ? rowsOf(section) : null}
                    </div>`)}`}
        </div>
        <${ListColumnFooterComp} mirror=${mirror} services=${services} />
    </aside>`;
}
