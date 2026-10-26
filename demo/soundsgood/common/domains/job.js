class Job {
    constructor(fields = {}) {
        this.id = null;
        this.taskId = null;
        this.itemId = null;
        this.itemName = null;
        this.stage = 'TRANSCRIBE';
        this.state = 'READY'; // READY | RUNNING | NEEDS_YOU | FAILED | DONE
        this.progress = 0;
        this.message = null;
        this.orderingIndex = 0;
        this.attempts = 1;
        this.startedAt = null;
        this.finishedAt = null;
        this.archived = false; // a done job: kept for analysis, shown on no screen
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = Job;
