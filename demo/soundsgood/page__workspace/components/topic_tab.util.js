class TopicTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.topicStoreData];
    }

    static fromDeps([topicStoreData], params) {
        return new TopicTabGuard({ topic: topicStoreData.topics.find((each) => each.id === TabId.entityIdOf(params.tabId)) || null });
    }
}
