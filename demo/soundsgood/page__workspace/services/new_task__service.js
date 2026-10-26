// Scenarios of the new-task tabs: download a playlist or items from URLs, save a text, convert the audio files of the inbox.
class NewTaskService {
    constructor(store, navigation, task, notices, load) {
        this.store = store;
        this.navigation = navigation;
        this.task = task;
        this.notices = notices;
        this.load = load;
    }

    get current() {
        return this.store.current;
    }

    modeOf(tabId) {
        return NewTaskKind.of(this.task.entry(tabId).kind).mode;
    }

    async testUrls(tabId) {
        this.task.patchEditor(tabId, { testing: true });
        const { rows, warnings } = await PlanApi.test({ mode: this.modeOf(tabId), urls: PlanTable.parseUrls(this.task.entry(tabId).urlText) });
        this.task.patchEditor(tabId, { testing: false, tested: true, planRows: rows, warnings });
    }

    setPlanRows(tabId, rows) {
        this.task.patchEditor(tabId, { planRows: rows });
    }

    // Proceed adds the entries to meta.json (the groups that are new were agreed to, or Auto is ticked), then makes the jobs of the ticked stages.
    async proceedUrls(tabId) {
        const entry = this.task.entry(tabId);
        const rows = entry.auto && !entry.tested ? (await PlanApi.test({ mode: this.modeOf(tabId), urls: PlanTable.parseUrls(entry.urlText) })).rows : entry.planRows;
        const result = await PlanApi.apply({ rows });
        await this.load.refresh();
        await this.finishList(tabId, result, entry.stageValues, rows.length > 0 ? rows[0].shape : 'VIDEOS_YOUTUBE');
    }

    async finishList(tabId, result, stageValues, shape) {
        let made = { task: null, jobs: [] };
        if (stageValues.length > 0 && result.itemIds.length > 0) {
            const items = this.current.itemStoreData.items.filter((item) => result.itemIds.includes(item.id));
            made = await TaskApi.create({ name: StageRules.taskName(stageValues, this.task.groupNamesOf(items)), shape, stageValues, itemIds: result.itemIds });
        }
        const task = made.task;
        this.notices.info(result.itemIds.length > 0 ? `List made: ${result.itemIds.length} item(s)${task ? `, task made: ${made.jobs.length} job(s)` : ''}` : 'Nothing added: the items are stored already');
        this.task.becomeTask(tabId, task);
        if (result.groups.length > 0) this.navigation.reveal(shape);
        await this.load.refresh();
    }

    // The optional URL of a video text: Test fills the creator, the title and the date.
    async testTextUrl(tabId) {
        const entry = this.task.entry(tabId);
        const { rows } = await PlanApi.test({ mode: 'ITEM', urls: [entry.url.trim()] });
        if (rows.length === 0) return this.notices.error('That URL is not one video', entry.url);
        const row = rows[0];
        const group = this.current.groupStoreData.groups.find((each) => each.shape === row.shape && each.name === row.goesTo);
        this.task.patchEditor(tabId, { platform: row.shape, groupId: group ? group.id : null, groupName: group ? '' : row.goesTo, title: row.title });
    }

    async proceedText(tabId) {
        const entry = this.task.entry(tabId);
        const kind = NewTaskKind.of(entry.kind);
        const { item, skipped } = await ItemApi.saveText({ subject: kind.subject, shape: entry.platform, groupId: entry.groupId, groupName: entry.groupName, lessonId: entry.lessonId, title: entry.title, date: entry.date, time: entry.time, text: entry.text });
        await this.load.refresh();
        if (skipped) return this.notices.error('That text is stored already', item.name);
        this.notices.info(`Text saved: ${item.name}`);
        let task = null;
        if (entry.stageValues.includes('SUMMARISE')) {
            const group = this.current.groupStoreData.groups.find((each) => each.id === item.groupId);
            task = (await TaskApi.create({ name: StageRules.taskName(['SUMMARISE'], [group.name]), shape: group.shape, stageValues: ['SUMMARISE'], itemIds: [item.id] })).task;
            if (task) this.task.showJobs();
        }
        this.navigation.closeTab(tabId);
        this.navigation.openTab(TabId.item(item.id));
        await this.load.refresh();
    }

    async proceedAudio(tabId) {
        const entry = this.task.entry(tabId);
        const result = await InboxApi.register(entry.inboxTickedIds);
        await this.load.refresh();
        await this.finishList(tabId, result, entry.stageValues, 'MEETINGS');
    }
}
