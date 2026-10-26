/*
// 1 central store sent to ui components to avoid all merging and zipping and other complexity
CentralStoreData                   (immutable itself and all child objects)
|-- shipmentStoreData              (singleton domain data collection)
|-- productsStoreData              (singleton domain data collection)
|-- <page>StoreData                (one field per page, each its own class, holds the page's activeItems for ui state)
|-- systemActiveItems              (system-wide shared activeItems for ui state, persist to file or db if needed)
+-- shoppingCartEditorDataEntries          (editor data by tabs)
    |--"cart-1" : shoppingCartEditorData   (contains version for own undo/redo, contains own activeItems)
    +--"cart-2" : shoppingCartEditorData   (contains version for own undo/redo, contains own activeItems)

// read
centralStore.subscribe((centralStoreData) => {
    const productsStoreData = centralStoreData.productsStoreData;
    const myCart = centralStoreData.shoppingCartEditorDataEntries["cart-5"];
    // ui component only trigger draw if every <topic>StoreData / <topic>EditorData it needs are ready
    // if myCart is removed later, trigger component destroy
    // ui only redraws if a field of its <Component>Data differs (field diff, see change_detection.js and vanilla_lifecycle.js) - separate implementation, not observables related
});

// write
- full CentralStoreData update in central data store, with the version number of the respective editor data
- call next(centralStoreData) - on any small change to CentralStoreData. Let the components' field diff (change_detection.js) protect the components

// note
- if undo/redo needed, have a subscription to receive EditorData and make use of version
- design the system to avoid different open editors updating the same domain data. otherwise editors have mismatching domains, and undo have worse mismatching problems

// usage
- CentralStore (central_store.js) holds CentralStoreData: get current, subscribe(fn), next(data), put(field, value), patch(field, changes), patchActiveItems(field, changes)
- put and patch check the write once (unknown field, type change, other class), so nothing is checked at read or broadcast time
*/

const broadcasterEmptyFn = () => {};

class BroadcasterObservable {
    #subject;
    #nextFn;

    constructor(subject, nextFn) {
        this.#subject = subject;
        this.#nextFn = nextFn;
    }

    // One handler per endpoint; re-subscribe replaces.
    subscribe(next) {
        this.#nextFn = next;
        return this;
    }

    unsubscribe() {
        if (this.#subject) {
            this.#subject.removeObservable(this);
        }
        this.#subject = null;
        this.#nextFn = broadcasterEmptyFn;
    }

    // Send full store data, subscriber picks what it needs.
    next(data) {
        this.#nextFn(data);
    }
}

class Broadcaster {
    #observables = [];

    asObservable() {
        const observable = new BroadcasterObservable(this, broadcasterEmptyFn);
        this.#observables.push(observable);
        return observable;
    }

    removeObservable(observable) {
        const index = this.#observables.indexOf(observable);
        if (index > -1) {
            this.#observables.splice(index, 1);
        }
    }

    // Emit on any change; renderer protects components.
    // Copy first: a subscriber may unsubscribe during the broadcast.
    next(data) {
        [...this.#observables].forEach((o) => o.next(data));
    }

    clear() {
        // Copy first: unsubscribe mutates #observables.
        [...this.#observables].forEach((o) => o.unsubscribe());
    }
}

if (typeof module !== 'undefined') module.exports = Broadcaster;
