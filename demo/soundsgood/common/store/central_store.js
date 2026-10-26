// The db for CentralStoreData: it holds, enforces the shape of a write, and broadcasts. No business logic.
// Needs Broadcaster (broadcaster.js), ChangeDetection (change_detection.js) and Immutable (immutable.js).

class CentralStore {
    #broadcaster = new Broadcaster();
    #centralStoreData;

    constructor(centralStoreData) {
        this.#centralStoreData = centralStoreData;
    }

    get current() {
        return this.#centralStoreData;
    }

    subscribe(fn) {
        return this.#broadcaster.asObservable().subscribe(fn);
    }

    next(centralStoreData) {
        this.#centralStoreData = centralStoreData;
        this.#broadcaster.next(centralStoreData);
    }

    // Replace one field of CentralStoreData. Refused when the class differs from what the field holds.
    put(field, value) {
        if (this.#centralStoreData[field] === value) return;
        Immutable.checkSameClass(this.#centralStoreData[field], value, field);
        this.next(this.#centralStoreData.with(field, Immutable.deepFreeze(value)));
    }

    // Change fields of the activeItems a <page>StoreData or <topic>EditorData holds. Same checks and no broadcast when nothing changed.
    patchActiveItems(field, changes) {
        const holder = this.#centralStoreData[field];
        if (Object.keys(changes).every((key) => ChangeDetection.same(holder.activeItems[key], changes[key]))) return;
        this.put(field, Immutable.with(holder, { activeItems: Immutable.with(holder.activeItems, changes) }));
    }

    // Change fields of a top level ActiveItems class, e.g. systemActiveItems. Refused for an unknown field or a type change. No broadcast when nothing changed.
    patch(field, changes) {
        const current = this.#centralStoreData[field];
        if (Object.keys(changes).every((key) => ChangeDetection.same(current[key], changes[key]))) return;
        this.put(field, Immutable.with(current, changes));
    }
}

if (typeof module !== 'undefined') module.exports = CentralStore;
