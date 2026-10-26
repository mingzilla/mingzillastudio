// Scenarios: make a task from the ticked items or an item tab, pause and edit it, resume it, control its jobs, reorder.
class TaskService {
    constructor(store, navigation, selection, notices, load) {
        this.store = store;
        this.navigation = navigation;
        this.selection = selection;
        this.notices = notices;
        this.load = load;
    }

    get current() {
        return this.store.current;
    }

    entry(tabId) {
        return this.current.taskEditorDataEntries.entries[tabId];
    }

    patchEditor(tabId, changes) {
        const entry = this.entry(tabId) || new TaskEditorData({ tabId });
        this.navigation.putEditor(tabId, { ...entry, ...changes });
    }

    setStage(tabId, stage, on) {
        this.patchEditor(tabId, { stageValues: StageRules.ticked((this.entry(tabId) || new TaskEditorData()).stageValues, stage, on) });
    }

    showJobs() {
        this.navigation.openColumn('jobs');
    }

    groupNamesOf(items) {
        const { groups } = this.current.groupStoreData;
        return items.map((item) => (groups.find((group) => group.id === item.groupId) || {}).name);
    }

    report(made) {
        if (made.task) this.notices.info(`Task made: ${made.jobs.length} job(s)${made.skipped ? `, ${made.skipped} skipped: in the job list already` : ''}`);
        else this.notices.info(made.skipped ? `No task made: ${made.skipped} job(s) are in the job list already` : 'Nothing to do: the items have these stages already');
    }

    // Proceed under the item list: one task for the ticked items.
    async proceedTicked() {
        const { shape, tickedItemIds, stageValues } = this.current.workspaceStoreData.activeItems;
        const jobs = this.current.taskStoreData.jobs;
        const activeIds = ContentScope.activeItemIds(jobs);
        const items = this.current.itemStoreData.items.filter((item) => tickedItemIds.includes(item.id) && ContentScope.isUnfinished(item, shape, activeIds));
        const made = await TaskApi.create({ name: StageRules.taskName(stageValues, this.groupNamesOf(items)), shape, stageValues, itemIds: items.map((item) => item.id) });
        this.selection.clear();
        if (made.task) this.showJobs();
        this.report(made);
    }

    // Proceed on the tab of one item: the stages that remain.
    async proceedItem(itemId, stageValues) {
        const item = this.current.itemStoreData.items.find((each) => each.id === itemId);
        const group = this.current.groupStoreData.groups.find((each) => each.id === item.groupId);
        const made = await TaskApi.create({ name: StageRules.taskName(stageValues, [group.name]), shape: group.shape, stageValues, itemIds: [itemId] });
        if (made.task) this.showJobs();
        this.report(made);
    }

    // After Proceed a new-task tab becomes the tab of its task.
    becomeTask(tabId, task) {
        this.navigation.closeTab(tabId);
        if (task) {
            this.navigation.openTab(TabId.task(task.id));
            this.showJobs();
        }
    }

    // Pause deletes the jobs of the task: a running job loses its work, what is done stays done.
    async pause(taskId) {
        await TaskApi.pause(taskId);
        this.notices.info('Task paused: it is in the list of tasks that do not run');
    }

    // Edit pauses the task and opens its tab.
    async edit(taskId) {
        await TaskApi.pause(taskId);
        this.navigation.openTab(TabId.task(taskId));
    }

    // Proceed on a task that does not run: new jobs for what is missing.
    async resume(taskId, stageValues) {
        const result = await TaskApi.resume(taskId, stageValues);
        if (result.added > 0) this.showJobs();
        this.notices.info(result.added > 0 ? `Task resumed: ${result.added} job(s)` : 'Nothing to do: the items have these stages already');
    }

    async cancelJob(jobId) {
        await TaskApi.cancelJob(jobId);
    }

    async retry(jobIds) {
        await TaskApi.retry(jobIds);
    }

    async reorderTasks(fromId, toId, after) {
        const tasks = JobOrder.moveTask(this.current.taskStoreData.tasks, fromId, toId, after);
        await TaskApi.reorderTasks(tasks.map((task) => task.id));
    }
}
