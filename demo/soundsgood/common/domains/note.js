// One note of a day file (an H2 block). It is consolidated when its id is up to the consolidated mark.
class Note {
    constructor(fields = {}) {
        this.id = null; // yyyymmdd_hhmmss
        this.time = null; // hhmmss
        this.text = '';
        this.consolidated = false;
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = Note;
