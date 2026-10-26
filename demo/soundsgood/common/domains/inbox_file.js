class InboxFile {
    constructor(fields = {}) {
        this.id = null;
        this.name = null;
        this.date = null; // yyyymmdd_hhmmss
        this.sizeMb = 0;
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = InboxFile;
