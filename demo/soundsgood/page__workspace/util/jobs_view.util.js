// What the jobs column shows: the overview of the lanes, a table for each running task, the list of tasks that do not run, the failed jobs.
class JobsView {
    static LIMIT = 20;
    static MIN_WIDTH = 520; // the width of one overview row and its padding (workspace__page.css)
    static LANES = [{ id: 'TRANSCRIPT', label: 'transcript', stages: ['TRANSCRIBE'] }, { id: 'SUMMARY', label: 'summary', stages: ['SUMMARISE'] }, { id: 'CONSOLIDATE', label: 'consolidate', stages: ['CONSOLIDATE'] }];

    // The first rows of a task table and the number of the rest.
    static tableRows(taskJobs, displays) {
        const rows = JobOrder.sorted(taskJobs).map((job) => ({ id: job.id, itemName: job.itemName, stage: job.stage, progress: job.progress, display: displays.get(job.id), actions: TaskState.actionsOf(displays.get(job.id).state) }));
        return { rows: rows.slice(0, JobsView.LIMIT), more: Math.max(0, rows.length - JobsView.LIMIT) };
    }

    // A job that cannot finish until the user acts is not in the estimate.
    static counts(display) {
        if (display.state === 'READY' || display.state === 'RUNNING') return true;
        return display.state === 'NOT_READY' && !/failed|needs you|no transcript job/.test(display.reason || '');
    }

    static formatEta(seconds) {
        if (seconds === null) return 'est. …';
        if (seconds < 60) return `est. ~${Math.max(1, Math.round(seconds))} s`;
        if (seconds < 3600) return `est. ~${Math.round(seconds / 60)} min`;
        return `est. ~${Math.floor(seconds / 3600)} h ${String(Math.round((seconds % 3600) / 60)).padStart(2, '0')} min`;
    }

    // A row for each lane: a bar of done, running and the rest of the run, `done/total`, and the time left.
    // The total is the finished jobs of the run plus the jobs in the list (a running job is neither done nor left).
    static lanes(jobs, displays, stats, summaryCapacity) {
        return JobsView.LANES.map((lane) => {
            const stage = lane.stages[0];
            const own = jobs.filter((job) => lane.stages.includes(job.stage));
            const count = (state) => own.filter((job) => displays.get(job.id).state === state).length;
            const done = stats.finished[stage];
            const capacity = lane.id === 'SUMMARY' ? summaryCapacity : 1;
            const counted = own.filter((job) => JobsView.counts(displays.get(job.id))).length;
            const median = stats.medianSeconds[stage];
            const seconds = counted === 0 ? 0 : median === null ? null : Math.ceil((counted * median) / capacity);
            const parts = { running: count('RUNNING'), waiting: count('READY'), blocked: count('NOT_READY'), needsYou: count('NEEDS_YOU'), failed: count('FAILED') };
            return {
                id: lane.id,
                stage,
                label: lane.label,
                done,
                running: parts.running,
                total: done + own.length,
                kind: own.length === 0 ? 'IDLE' : counted === 0 ? 'STUCK' : 'WORK',
                seconds,
                etaText: own.length === 0 ? 'idle' : counted === 0 ? 'stuck' : JobsView.formatEta(seconds),
                title: `${done} done · ${parts.running} of ${capacity} slots running · ${parts.waiting} waiting · ${parts.blocked} blocked · ${parts.needsYou} need you · ${parts.failed} failed`,
            };
        });
    }

    // One estimate for the run: the lanes run side by side, so it is the longest lane. The title is the estimate of each lane.
    static overall(lanes) {
        const working = lanes.filter((lane) => lane.kind === 'WORK');
        const title = lanes.map((lane) => `${lane.label}: ${lane.etaText}`).join('\n');
        if (working.length === 0) return { text: lanes.some((lane) => lane.kind === 'STUCK') ? 'stuck' : 'idle', title };
        if (working.some((lane) => lane.seconds === null)) return { text: JobsView.formatEta(null), title };
        return { text: JobsView.formatEta(Math.max(...working.map((lane) => lane.seconds))), title };
    }

    // Show Failed: a table of the failed jobs for each task, with the same rows as the tables of the running tasks.
    // The title of a label also says how many jobs the failed job blocks.
    static failedTables(jobs, tasks, displays) {
        return JobOrder.sorted(tasks)
            .map((task) => ({ task, failed: jobs.filter((job) => job.taskId === task.id && job.state === 'FAILED') }))
            .filter(({ failed }) => failed.length > 0)
            .map(({ task, failed }) => {
                const shown = new Map(failed.map((job) => [job.id, { ...displays.get(job.id), reason: `${job.message || 'failed'}${JobReadiness.blockedBy(job, jobs).length > 0 ? ` · blocks ${JobReadiness.blockedBy(job, jobs).length} job(s)` : ''}` }]));
                return { id: task.id, name: task.name, total: failed.length, countsText: `${failed.length} failed`, showActions: false, ...JobsView.tableRows(failed, shown) };
            });
    }
}

if (typeof module !== 'undefined') module.exports = JobsView;
