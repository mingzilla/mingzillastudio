// Base class of every enum: `value` is the UPPER_SNAKE text that travels to and from the backend, `label` is the text the ui shows.
// A subclass declares its values as static instances and ends with `static ALL = EnumValue.define([...])`; `of(raw)` is `EnumValue.find(Class.ALL, raw)`.
// An enum value is a singleton: compare with ===, use `value` as a map key.

class EnumValue {
    constructor(value, label) {
        this.value = value;
        this.label = label;
    }

    static define(all) {
        all.forEach(each => Object.freeze(each));
        return Object.freeze(all);
    }

    static find(all, raw) {
        const found = all.find(each => each.value === raw);
        if (!found) throw new Error(`unknown enum value: ${raw}`);
        return found;
    }
}

if (typeof module !== 'undefined') module.exports = EnumValue;
