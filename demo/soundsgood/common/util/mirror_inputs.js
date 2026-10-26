// The base of every <Component>MirrorInputs: what a person can edit in a component, as a frozen copy. Needs Immutable (store/immutable.js) and ChangeDetection (store/change_detection.js).
// A component that has inputs always has this class, even for one field, so an edit works the same everywhere: with() is a guarded copy, changedKeys() says what differs.
// A fixed class declares static FIELDS = [...] and the constructor refuses any other set of keys; a schema driven class declares static FIELDS = null, its keys are dynamic.
// with() refuses a key the copy does not have either way.

class MirrorInputs {
    constructor(fields) {
        const shape = new.target.FIELDS;
        if (shape) MirrorInputs.checkShape(new.target.name, shape, fields);
        Object.assign(this, fields);
        Object.freeze(this);
    }

    static checkShape(name, shape, fields) {
        const given = Object.keys(fields);
        const missing = shape.filter((key) => !given.includes(key));
        const extra = given.filter((key) => !shape.includes(key));
        if (missing.length || extra.length) throw new Error(`${name} takes ${shape.join(', ')}: missing [${missing.join(', ')}], unexpected [${extra.join(', ')}]`);
    }

    with(changes) {
        return Immutable.with(this, changes);
    }

    changedKeys(other) {
        return Object.keys(this).filter((key) => !ChangeDetection.same(this[key], other[key]));
    }
}

if (typeof module !== 'undefined') module.exports = MirrorInputs;
