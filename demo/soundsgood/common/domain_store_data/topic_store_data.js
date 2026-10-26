class TopicStoreData {
    constructor(fields = {}) {
        this.topics = [];
        this.loaded = false;
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = TopicStoreData;
