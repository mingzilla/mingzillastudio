// The meta.json entry of an item, plus the flags of the files that exist (the state is worked out from them, never stored).
// A note day file has its notes, each marked consolidated or not by the consolidated mark.
class Item {
    constructor(fields = {}) {
        this.id = null;
        this.groupId = null;
        this.name = null; // the stem
        this.key = null;
        this.title = null;
        this.source = null;
        this.type = 'video';
        this.summaryLine = null;
        this.hasRaw = false;
        this.hasSummary = false;
        this.stale = false;
        this.notes = [];
        this.rawText = null;
        this.summaryText = null;
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = Item;
