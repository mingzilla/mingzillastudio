class VoiceTypoStoreData {
    constructor(fields = {}) {
        this.typos = [];
        this.loaded = false;
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = VoiceTypoStoreData;
