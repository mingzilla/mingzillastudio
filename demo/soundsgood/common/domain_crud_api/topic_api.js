class TopicApi {
    static async list() {
        return PrototypeWorld.topics;
    }

    static async move(id, folder) {
        PrototypeWorld.topics = PrototypeWorld.replaced(PrototypeWorld.topics, id, Topic, { folder });
        PrototypeWorld.emit();
    }
}
