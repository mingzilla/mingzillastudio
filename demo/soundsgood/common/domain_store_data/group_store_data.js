class GroupStoreData {
    constructor(fields = {}) {
        this.groups = [];
        this.loaded = false;
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = GroupStoreData;
