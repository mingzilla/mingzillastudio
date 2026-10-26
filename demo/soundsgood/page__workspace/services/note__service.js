class NoteService {
    constructor(store, navigation, task, notices, load) {
        this.store = store;
        this.navigation = navigation;
        this.task = task;
        this.notices = notices;
        this.load = load;
    }

    // Save notes: instant, not a task.
    async save(tabId, text) {
        if (text.trim() === '') return;
        await NoteApi.save(text.trim());
        this.task.patchEditor(tabId, { noteText: '' });
        this.notices.info('Note saved');
        await this.load.refresh();
    }

    async update(itemId, noteId, text) {
        const done = await NoteApi.update(itemId, noteId, text.trim());
        if (done) this.notices.info('Note saved');
        else this.notices.error('A consolidated note cannot be edited');
    }

    // Consolidation is one task with a job for each day file that has notes after the consolidated mark, in date order.
    async consolidate() {
        const jobs = this.store.current.taskStoreData.jobs;
        const activeIds = ContentScope.activeItemIds(jobs);
        const items = this.store.current.itemStoreData.items.filter((item) => this.shapeOf(item) === 'NOTES' && ContentScope.isUnfinished(item, 'NOTES', activeIds)).sort((a, b) => a.name.localeCompare(b.name));
        const made = await TaskApi.create({ name: StageRules.taskName(['CONSOLIDATE'], []), shape: 'NOTES', stageValues: ['CONSOLIDATE'], itemIds: items.map((item) => item.id) });
        if (made.task) this.task.showJobs();
        this.task.report(made);
    }

    shapeOf(item) {
        const group = this.store.current.groupStoreData.groups.find((each) => each.id === item.groupId);
        return group ? group.shape : null;
    }
}
