class Group {
    constructor(fields = {}) {
        this.id = null;
        this.shape = 'COURSE';
        this.name = null;
        this.displayName = null;
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = Group;
