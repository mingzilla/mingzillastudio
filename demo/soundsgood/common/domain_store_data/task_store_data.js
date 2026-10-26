class TaskStoreData {
    constructor(fields = {}) {
        this.tasks = [];
        this.jobs = [];
        this.stats = new JobStats();
        this.loaded = false;
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = TaskStoreData;
