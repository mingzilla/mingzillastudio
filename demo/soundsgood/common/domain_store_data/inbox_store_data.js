class InboxStoreData {
    constructor(fields = {}) {
        this.files = [];
        this.loaded = false;
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = InboxStoreData;
