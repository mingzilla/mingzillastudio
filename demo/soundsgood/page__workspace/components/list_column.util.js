class ListColumnGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.workspaceStoreData.activeItems, centralStoreData.groupStoreData, centralStoreData.itemStoreData, centralStoreData.taskStoreData, centralStoreData.topicStoreData];
    }

    static fromDeps([activeItems, groupStoreData, itemStoreData, taskStoreData, topicStoreData], params) {
        return new ListColumnGuard({
            content: activeItems.content,
            shape: activeItems.shape,
            tickedItemIds: activeItems.tickedItemIds,
            collapsedGroupIds: activeItems.collapsedGroupIds,
            expandedGroupIds: activeItems.expandedGroupIds,
            notesView: activeItems.notesView,
            topicFolder: activeItems.topicFolder,
            stageValues: activeItems.stageValues,
            groups: groupStoreData.groups,
            items: itemStoreData.items,
            jobs: taskStoreData.jobs,
            topics: topicStoreData.topics,
        });
    }
}

class ListColumnDataMirror extends DataMirror {
    static EMPTY = { UNFINISHED: 'Nothing to do.', FINISHED: 'Nothing is finished yet.', ALL: 'No items.' };
    static VIEWS = [{ id: 'DAILY', label: 'Daily' }, { id: 'TOPICS', label: 'Topics' }];

    static DOT = { RUNNING: 'running', FAILED: 'failed', NEEDS_YOU: 'needs_you', READY: 'queued', NOT_READY: 'queued' };

    // An item that has a job is under processing: the dot of its most active job (running, then failed, then needs you, then queued).
    static dotOf(itemId, displays, jobs) {
        const own = jobs.filter((each) => each.itemId === itemId);
        const rank = (job) => ['RUNNING', 'FAILED', 'NEEDS_YOU'].indexOf(displays.get(job.id).state);
        const best = [...own].sort((a, b) => (rank(a) === -1 ? 9 : rank(a)) - (rank(b) === -1 ? 9 : rank(b)))[0];
        if (!best) return null;
        const display = displays.get(best.id);
        return { kind: ListColumnDataMirror.DOT[display.state], title: `${best.stage.toLowerCase()} ${JobState.of(display.state).label}${display.reason ? `: ${display.reason}` : ''}` };
    }

    static rowOf(item, isNotes, ticked, displays, jobs) {
        const left = item.notes.filter((note) => !note.consolidated).length;
        const dot = ListColumnDataMirror.dotOf(item.id, displays, jobs);
        return {
            id: item.id,
            name: item.name,
            marks: isNotes ? { meta: true, raw: true, summary: left === 0, stale: false } : ItemMarks.marksOf(item),
            ticked,
            summaryLine: item.summaryLine,
            dot,
            detail: dot === null && isNotes && left > 0 ? `${left} new` : null,
            detailTitle: 'notes after the consolidated mark',
        };
    }

    static topicViewsOf(topics) {
        return TopicFolder.ALL.map((folder) => ({ id: folder.value, label: folder.label.charAt(0).toUpperCase() + folder.label.slice(1), count: topics.filter((topic) => topic.folder === folder.value).length }));
    }

    static from(guard) {
        const shape = Shape.of(guard.shape);
        const isNotes = guard.shape === 'NOTES';
        const unfinished = guard.content === 'UNFINISHED';
        const mode = unfinished ? 'LIST' : isNotes && guard.notesView === 'TOPICS' ? 'TOPICS' : 'TREE';
        const activeIds = ContentScope.activeItemIds(guard.jobs);
        const displays = JobReadiness.displays(guard.jobs, guard.items);
        const tickable = unfinished && !isNotes;
        const sections = ContentScope.sections(guard.groups, guard.items, guard.shape, guard.content, activeIds).map(({ group, items }) => {
            const rows = items.map((item) => ListColumnDataMirror.rowOf(item, isNotes, guard.tickedItemIds.includes(item.id), displays, guard.jobs));
            const open = unfinished ? !guard.collapsedGroupIds.includes(group.id) : guard.expandedGroupIds.includes(group.id);
            return { groupId: group.id, title: group.displayName || group.name, count: rows.length, open, tickable, itemIds: items.map((item) => item.id), allTicked: rows.length > 0 && rows.every((row) => row.ticked), rows };
        });
        const shown = sections.flatMap((section) => section.rows.map((row) => row.id));
        const tickedItems = guard.items.filter((item) => shown.includes(item.id) && guard.tickedItemIds.includes(item.id));
        return new ListColumnDataMirror({
            mode,
            title: shape.label,
            isNotes,
            views: isNotes && !unfinished ? ListColumnDataMirror.VIEWS : null,
            topicViews: mode === 'TOPICS' ? ListColumnDataMirror.topicViewsOf(guard.topics) : null,
            topicRows: guard.topics.filter((topic) => topic.folder === guard.topicFolder).map((topic) => ({ id: topic.id, title: `${String(topic.number).padStart(5, '0')}__${topic.name}` })),
            sections,
            tickable,
            shownIds: shown,
            tickedCount: tickedItems.length,
            stageValues: guard.stageValues,
            canProceed: StageRules.canProceed(tickedItems, guard.stageValues),
            notesLeft: guard.items.filter((item) => shown.includes(item.id)).reduce((sum, item) => sum + item.notes.filter((note) => !note.consolidated).length, 0),
            emptyText: ListColumnDataMirror.EMPTY[guard.content],
            offerCreate: unfinished,
        });
    }
}
