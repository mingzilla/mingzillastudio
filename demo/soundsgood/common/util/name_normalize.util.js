// A name made on disk: lower case letters, digits and `_`. Any other character, a space included, becomes `_`; a run of them becomes one `_`.
class NameNormalize {
    static of(text) {
        return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    }

    static stem(prefix, title) {
        return `${prefix}__${NameNormalize.of(title)}`;
    }
}

if (typeof module !== 'undefined') module.exports = NameNormalize;
