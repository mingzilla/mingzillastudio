// NOT_READY is never stored. A job is NOT_READY when its input does not exist yet and the job that makes it is not done.
class JobReadiness {
    static displayOf(job, jobs, items) {
        if (job.state !== 'READY') return { state: job.state, reason: job.message };
        if (job.stage === 'SUMMARISE') {
            const item = items.find((each) => each.id === job.itemId);
            if (item && item.hasRaw) return { state: 'READY', reason: null };
            const producer = jobs.find((each) => each.itemId === job.itemId && each.stage === 'TRANSCRIBE');
            if (!producer) return { state: 'NOT_READY', reason: 'no transcript job' };
            if (producer.state === 'FAILED') return { state: 'NOT_READY', reason: 'transcribe failed' };
            if (producer.state === 'NEEDS_YOU') return { state: 'NOT_READY', reason: 'transcribe needs you' };
            return { state: 'NOT_READY', reason: 'after transcribe' };
        }
        if (job.stage === 'CONSOLIDATE') {
            const before = jobs.filter((each) => each.stage === 'CONSOLIDATE' && each.itemName < job.itemName).sort((a, b) => a.itemName.localeCompare(b.itemName));
            if (before.length === 0) return { state: 'READY', reason: null };
            const failed = before.find((each) => each.state === 'FAILED');
            if (failed) return { state: 'NOT_READY', reason: `${failed.itemName} failed` };
            return { state: 'NOT_READY', reason: `after ${before[before.length - 1].itemName}` };
        }
        return { state: 'READY', reason: null };
    }

    // jobId -> { state, reason }
    static displays(jobs, items) {
        return new Map(jobs.map((job) => [job.id, JobReadiness.displayOf(job, jobs, items)]));
    }

    // The jobs that wait for a failed job.
    static blockedBy(failed, jobs) {
        if (failed.stage === 'TRANSCRIBE') return jobs.filter((job) => job.itemId === failed.itemId && job.stage === 'SUMMARISE');
        if (failed.stage === 'CONSOLIDATE') return jobs.filter((job) => job.stage === 'CONSOLIDATE' && job.itemName > failed.itemName);
        return [];
    }
}

if (typeof module !== 'undefined') module.exports = JobReadiness;
