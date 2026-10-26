class Topic {
    constructor(fields = {}) {
        this.id = null;
        this.folder = 'DRAFT';
        this.number = null;
        this.name = null;
        this.tldr = null;
        this.body = null;
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = Topic;
