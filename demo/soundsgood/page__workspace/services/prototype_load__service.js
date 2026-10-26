// Puts the answers of the api in the store. Prototype: the world calls back after every change; the real app polls.
class PrototypeLoadService {
    constructor(store) {
        this.store = store;
    }

    async start() {
        await this.refresh();
        const preference = await PreferenceApi.load();
        const hasJobs = this.store.current.taskStoreData.jobs.length > 0;
        this.store.put('userPreferenceStoreData', new UserPreferenceStoreData({ ...preference, jobsOpen: preference.jobsOpen || hasJobs, loaded: true }));
        TaskApi.watch(() => this.refresh());
        PrototypeWorld.start();
    }

    async refresh() {
        const [groups, work, typos, topics, files] = await Promise.all([GroupApi.list(), TaskApi.listAll(), VoiceTypoApi.list(), TopicApi.list(), InboxApi.list()]);
        const items = await ItemApi.listAll();
        this.store.put('groupStoreData', new GroupStoreData({ groups, loaded: true }));
        this.store.put('taskStoreData', new TaskStoreData({ tasks: work.tasks, jobs: work.jobs, stats: work.stats, loaded: true }));
        this.store.put('voiceTypoStoreData', new VoiceTypoStoreData({ typos, loaded: true }));
        this.store.put('topicStoreData', new TopicStoreData({ topics, loaded: true }));
        this.store.put('inboxStoreData', new InboxStoreData({ files, loaded: true }));
        this.store.put('itemStoreData', new ItemStoreData({ items, loaded: true }));
    }
}
