// Write-time enforcement for store data: checks run once per write, on the changed keys. Nothing runs at read or broadcast time.
// Classes of <page>StoreData / <topic>EditorData / ActiveItems list every field in their constructor, so that list is the schema.

class Immutable {
    static deepFreeze(value) {
        if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
        Object.freeze(value);
        Object.values(value).forEach(Immutable.deepFreeze);
        return value;
    }

    // A field must exist, and keep its type. null / undefined can become a value and back.
    static checkField(source, key, value) {
        const name = source.constructor.name;
        if (!Object.hasOwn(source, key)) throw new Error(`${name} has no field ${key}`);
        const current = source[key];
        const empty = (each) => each === null || each === undefined;
        if (!empty(current) && !empty(value) && typeof current !== typeof value) {
            throw new Error(`${name}.${key} holds ${typeof current}, not ${typeof value}`);
        }
    }

    static checkSameClass(current, value, field) {
        if (current === undefined) throw new Error(`no field ${field}`);
        if (Object.getPrototypeOf(value) !== Object.getPrototypeOf(current)) {
            throw new Error(`${field} holds ${current.constructor.name}, not ${value.constructor.name}`);
        }
    }

    // Same class as source, frozen, only the changed fields are new.
    static with(source, changes) {
        Object.keys(changes).forEach((key) => Immutable.checkField(source, key, changes[key]));
        return Immutable.deepFreeze(Object.assign(Object.create(Object.getPrototypeOf(source)), source, changes));
    }
}

if (typeof module !== 'undefined') module.exports = Immutable;
