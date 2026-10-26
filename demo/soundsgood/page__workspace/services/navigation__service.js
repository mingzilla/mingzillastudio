// Scenarios: choose a shape or what the list shows; open and close tabs; open the Create Task pop-up.
class NavigationService {
    constructor(store, load) {
        this.store = store;
        this.load = load;
    }

    get active() {
        return this.store.current.workspaceStoreData.activeItems;
    }

    // Clicking the active shape again closes or opens the groups column, as in VS Code.
    pickShape(shape) {
        if (this.active.shape === shape) this.toggleColumn('list');
        else {
            this.chooseShape(shape);
            this.openColumn('list');
        }
    }

    chooseShape(shape) {
        this.store.patchActiveItems('workspaceStoreData', { shape, tickedItemIds: [], notesView: 'DAILY' });
    }

    setContent(content) {
        this.store.patchActiveItems('workspaceStoreData', { content, tickedItemIds: [] });
        this.openColumn('list');
    }

    // Show the list of what a task just made.
    reveal(shape) {
        this.store.patchActiveItems('workspaceStoreData', { content: 'UNFINISHED', shape, tickedItemIds: [] });
        this.openColumn('list');
    }

    // Main is chosen each time Topics opens.
    setNotesView(notesView) {
        this.store.patchActiveItems('workspaceStoreData', { notesView, topicFolder: 'MAIN' });
    }

    setTopicFolder(topicFolder) {
        this.store.patchActiveItems('workspaceStoreData', { topicFolder });
    }

    openTab(tabId) {
        const preference = this.store.current.userPreferenceStoreData;
        if (!preference.openTabIds.includes(tabId)) this.store.patch('userPreferenceStoreData', { openTabIds: [...preference.openTabIds, tabId] });
        this.store.patchActiveItems('workspaceStoreData', { activeTabId: tabId });
    }

    closeTab(tabId) {
        const preference = this.store.current.userPreferenceStoreData;
        const ids = preference.openTabIds;
        const at = ids.indexOf(tabId);
        const rest = ids.filter((id) => id !== tabId);
        this.store.patch('userPreferenceStoreData', { openTabIds: rest });
        if (this.active.activeTabId === tabId) this.store.patchActiveItems('workspaceStoreData', { activeTabId: rest[Math.min(at, rest.length - 1)] ?? '' });
        const entries = this.store.current.taskEditorDataEntries.entries;
        if (entries[tabId]) {
            const { [tabId]: gone, ...kept } = entries;
            this.store.put('taskEditorDataEntries', new TaskEditorDataEntries({ entries: kept }));
        }
    }

    closeOthers(tabId) {
        this.store.current.userPreferenceStoreData.openTabIds.filter((id) => id !== tabId).forEach((id) => this.closeTab(id));
    }

    closeLeft(tabId) {
        const ids = this.store.current.userPreferenceStoreData.openTabIds;
        ids.slice(0, ids.indexOf(tabId)).forEach((id) => this.closeTab(id));
    }

    closeRight(tabId) {
        const ids = this.store.current.userPreferenceStoreData.openTabIds;
        ids.slice(ids.indexOf(tabId) + 1).forEach((id) => this.closeTab(id));
    }

    openItem(item) {
        this.openTab(TabId.item(item.id));
    }

    putEditor(tabId, fields) {
        const { entries } = this.store.current.taskEditorDataEntries;
        this.store.put('taskEditorDataEntries', new TaskEditorDataEntries({ entries: { ...entries, [tabId]: new TaskEditorData({ tabId, ...fields }) } }));
    }

    // The tab of a kind is opened once; a second click shows it.
    openNewTask(kind) {
        const tabId = TabId.newTask(kind);
        if (!this.store.current.taskEditorDataEntries.entries[tabId]) this.putEditor(tabId, NavigationService.defaultsOf(kind));
        this.closeCreateTask();
        this.openTab(tabId);
    }

    static defaultsOf(kind) {
        const { date, time } = DateText.now();
        if (kind === 'MEETING_AUDIO') return { kind, stageValues: ['TRANSCRIBE'] };
        return { kind, date, time };
    }

    openNewNote() {
        if (!this.store.current.taskEditorDataEntries.entries[TabId.NEW_NOTE]) this.putEditor(TabId.NEW_NOTE, {});
        this.closeCreateTask();
        this.openTab(TabId.NEW_NOTE);
    }

    openCreateTask() {
        this.store.patchActiveItems('workspaceStoreData', { createTaskOpen: true });
    }

    closeCreateTask() {
        this.store.patchActiveItems('workspaceStoreData', { createTaskOpen: false });
    }

    toggleColumn(column) {
        const field = `${column}Open`;
        this.store.patch('userPreferenceStoreData', { [field]: !this.store.current.userPreferenceStoreData[field] });
    }

    openColumn(column) {
        this.store.patch('userPreferenceStoreData', { [`${column}Open`]: true });
    }
}
