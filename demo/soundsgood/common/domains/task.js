// What the user asked for: the stages and the items. Its state is worked out from its jobs and the files.
class Task {
    constructor(fields = {}) {
        this.id = null;
        this.name = null;
        this.shape = 'COURSE';
        this.stageValues = []; // ['TRANSCRIBE', 'SUMMARISE'] or ['CONSOLIDATE']
        this.itemIds = [];
        this.orderingIndex = 0;
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = Task;
