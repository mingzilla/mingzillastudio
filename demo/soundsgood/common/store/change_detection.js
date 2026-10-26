/*
// Framework neutral: plain functions on plain values, no DOM, no store, no framework. Used by every adapter and by CentralStore.
// A component's guard (see SKILL.md, Component layers) is compared by reference. Primitives and strings by value. Nothing by content.
// An array is compared item by item, in order, one level deep: a list re-created with the same items is not a change.
// A guard still never holds an object that layer 3 (processing) would have built.
*/

class ChangeDetection {
    static same(previous, next) {
        if (Array.isArray(previous) && Array.isArray(next)) {
            return previous.length === next.length && previous.every((item, index) => Object.is(item, next[index]));
        }
        return Object.is(previous, next);
    }

    // Every field of both objects is compared, so a field added later is covered without a key list to forget.
    // It stops at the first difference and allocates no key set: a field count that differs is already a change.
    static fieldsChanged(previous, next) {
        if (previous == null || next == null) return previous !== next;
        const keys = Object.keys(previous);
        if (keys.length !== Object.keys(next).length) return true;
        return keys.some((key) => !Object.hasOwn(next, key) || !ChangeDetection.same(previous[key], next[key]));
    }

    // Returns what to hold: next when it differs (whenChanged ran first), otherwise previous.
    static ifFieldsChanged(previous, next, whenChanged) {
        if (!ChangeDetection.fieldsChanged(previous, next)) return previous;
        whenChanged(next);
        return next;
    }

    // deps is the list getDataDeps returned. A missing dep means the component is not ready.
    static ready(deps) {
        return Array.isArray(deps) && deps.every((dep) => dep != null);
    }
}

if (typeof module !== 'undefined') module.exports = ChangeDetection;
