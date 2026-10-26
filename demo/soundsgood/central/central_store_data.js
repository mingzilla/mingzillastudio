// The root of the store's data: one field per <page>StoreData, <topic>StoreData and <topic>EditorData, each its own class, plus systemActiveItems. activeItems live inside <page>StoreData and <topic>EditorData.
// Needs Immutable (store/immutable.js). Deep-frozen when made, and again by with(), so a reader can never edit what it holds.
// CentralStoreData.create({ ownerStoreData: new OwnerStoreData(), ... }) is the first value a CentralStore gets.
// with(field, value) is a copy of the whole with one field replaced. The other fields keep their identity, so a guard that reads them sees no change.

class CentralStoreData {
    constructor(fields) {
        Object.assign(this, fields);
    }

    static create(fields) {
        return Immutable.deepFreeze(new CentralStoreData(fields));
    }

    with(field, value) {
        return Immutable.deepFreeze(Object.assign(Object.create(Object.getPrototypeOf(this)), this, { [field]: value }));
    }
}

if (typeof module !== 'undefined') module.exports = CentralStoreData;
