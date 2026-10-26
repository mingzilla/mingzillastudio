// The base of every <Component>DataMirror: the fields it is given, frozen. A subclass adds only static methods; from(guard, params) is its only creator.
// A DataMirror is frozen (shallow), so it is never edited after processing, and its groups are inputs, <field>Options and uiState.

class DataMirror {
    constructor(fields) {
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = DataMirror;
