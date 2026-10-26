// All items the app knows (prototype scale). A real server would send the items of the chosen group; the key it was loaded for would be a field here.
class ItemStoreData {
    constructor(fields = {}) {
        this.items = [];
        this.loaded = false;
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = ItemStoreData;
