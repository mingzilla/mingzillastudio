class WorkspaceTabStripGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.userPreferenceStoreData, centralStoreData.workspaceStoreData.activeItems, centralStoreData.itemStoreData, centralStoreData.taskStoreData, centralStoreData.topicStoreData];
    }

    static fromDeps([preference, activeItems, itemStoreData, taskStoreData, topicStoreData], params) {
        return new WorkspaceTabStripGuard({ openTabIds: preference.openTabIds, activeTabId: activeItems.activeTabId, items: itemStoreData.items, tasks: taskStoreData.tasks, topics: topicStoreData.topics });
    }
}

class WorkspaceTabStripDataMirror extends DataMirror {
    static MENU = [{ id: 'close', label: 'Close' }, { id: 'others', label: 'Close other tabs' }, { id: 'left', label: 'Close tabs on left' }, { id: 'right', label: 'Close tabs on right' }];
    static ICONS = { ITEM: 'file', TASK: 'task', NEW_TASK: 'tasks', NEW_NOTE: 'NOTES', TOPIC: 'file', VOICE_TYPOS: 'typos', SETTINGS: 'settings' };

    static titleOf(guard, tabId) {
        const kind = TabId.kindOf(tabId);
        const id = TabId.entityIdOf(tabId);
        if (kind === 'ITEM') return (guard.items.find((item) => item.id === id) || {}).name || tabId;
        if (kind === 'TASK') return (guard.tasks.find((task) => task.id === id) || {}).name || tabId;
        if (kind === 'TOPIC') return (guard.topics.find((topic) => topic.id === id) || {}).name || tabId;
        if (kind === 'NEW_TASK') return NewTaskKind.of(TabId.newTaskKindOf(tabId)).tabTitle;
        if (kind === 'NEW_NOTE') return 'notes';
        return TabKind.of(kind).label;
    }

    static from(guard) {
        const tabs = guard.openTabIds.map((tabId) => {
            const kind = TabId.kindOf(tabId);
            const newTask = kind === 'NEW_TASK' ? NewTaskKind.of(TabId.newTaskKindOf(tabId)) : null;
            return { id: tabId, title: WorkspaceTabStripDataMirror.titleOf(guard, tabId), icon: WorkspaceIcons.of(newTask ? newTask.icon : WorkspaceTabStripDataMirror.ICONS[kind]), kindLabel: newTask ? newTask.label : TabKind.of(kind).label, menu: WorkspaceTabStripDataMirror.MENU, active: tabId === guard.activeTabId, isNew: TabId.isNew(tabId), dirty: false };
        });
        return new WorkspaceTabStripDataMirror({ tabs });
    }
}
