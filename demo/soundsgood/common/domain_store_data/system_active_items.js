class SystemActiveItems {
    constructor(fields = {}) {
        this.notices = []; // { id, kind: 'info'|'error', message, detail }
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = SystemActiveItems;
