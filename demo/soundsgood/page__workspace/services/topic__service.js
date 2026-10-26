class TopicService {
    constructor(notices) {
        this.notices = notices;
    }

    // Merge: a draft goes to main. Drop: main goes to superseded.
    async merge(topic) {
        await TopicApi.move(topic.id, 'MAIN');
        this.notices.info(`Merged ${topic.name} into main`);
    }

    async drop(topic) {
        await TopicApi.move(topic.id, 'SUPERSEDED');
        this.notices.info(`Moved ${topic.name} to superseded`);
    }
}
