// The stored states of a job. NOT_READY is worked out from the jobs and the files (job_readiness.util.js) and is never stored.
class JobState extends EnumValue {
    static READY = new JobState('READY', 'ready');
    static NOT_READY = new JobState('NOT_READY', 'not ready');
    static RUNNING = new JobState('RUNNING', 'running');
    static NEEDS_YOU = new JobState('NEEDS_YOU', 'needs you');
    static FAILED = new JobState('FAILED', 'failed');
    static DONE = new JobState('DONE', 'done');
    static ALL = EnumValue.define([JobState.READY, JobState.NOT_READY, JobState.RUNNING, JobState.NEEDS_YOU, JobState.FAILED, JobState.DONE]);

    static of(raw) {
        return EnumValue.find(JobState.ALL, raw);
    }
}

if (typeof module !== 'undefined') module.exports = JobState;
