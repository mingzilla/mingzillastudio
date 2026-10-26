// What the server counts about the jobs: the finished jobs of the current run, and the typical time of a job in each stage.
// A run is the time since the job list was last empty.
class JobStats {
    constructor(fields = {}) {
        this.finished = { TRANSCRIBE: 0, SUMMARISE: 0, CONSOLIDATE: 0 };
        this.medianSeconds = { TRANSCRIBE: null, SUMMARISE: null, CONSOLIDATE: null }; // null: no history yet
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = JobStats;
