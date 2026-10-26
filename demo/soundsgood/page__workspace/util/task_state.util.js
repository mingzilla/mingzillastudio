// The state of a task and the controls of a job. A task is what the user asked for; a job is one item in one stage.
// The state of a task is worked out from its jobs and the files, never stored: with jobs it is running; with no jobs and work left it is not running; with no work left it is done.
class TaskState {
    static ACTIONS = {
        READY: ['cancel'],
        NOT_READY: ['cancel'],
        RUNNING: ['cancel'],
        NEEDS_YOU: ['cancel'],
        FAILED: ['retry', 'cancel'],
    };

    static actionsOf(state) {
        return TaskState.ACTIONS[state] || [];
    }

    static lacks(item, stage) {
        if (stage === 'TRANSCRIBE') return !item.hasRaw;
        if (stage === 'SUMMARISE') return !item.hasSummary || item.stale;
        return item.notes.some((note) => !note.consolidated);
    }

    // The items of the task that still lack the output of a stage of the task.
    static itemsLeft(task, items) {
        return items.filter((item) => task.itemIds.includes(item.id) && task.stageValues.some((stage) => TaskState.lacks(item, stage)));
    }

    static stateOf(task, jobs, items) {
        if (jobs.length > 0) return 'RUNNING';
        return TaskState.itemsLeft(task, items).length > 0 ? 'NOT_RUNNING' : 'DONE';
    }

    static counts(displays) {
        const count = (state) => displays.filter((display) => display.state === state).length;
        return { running: count('RUNNING'), failed: count('FAILED'), needsYou: count('NEEDS_YOU'), waiting: count('READY'), blocked: count('NOT_READY') };
    }

    // Pause and Edit stop the running jobs of the task, and those jobs lose their work. The jobs of other tasks that wait for them stay.
    static pauseWarning(taskJobs, allJobs) {
        const running = taskJobs.filter((job) => job.state === 'RUNNING').length;
        const own = new Set(taskJobs.map((job) => job.id));
        const transcribed = new Set(taskJobs.filter((job) => job.stage === 'TRANSCRIBE').map((job) => job.itemId));
        const waiting = allJobs.filter((job) => !own.has(job.id) && job.stage === 'SUMMARISE' && transcribed.has(job.itemId)).length;
        return { running, waiting };
    }

    static pauseText({ running, waiting }) {
        const lost = `${running} running job${running === 1 ? '' : 's'} stop${running === 1 ? 's' : ''} and lose${running === 1 ? 's' : ''} the work.`;
        return waiting > 0 ? `${lost} ${waiting} job${waiting === 1 ? '' : 's'} in other tasks wait for them.` : lost;
    }
}

if (typeof module !== 'undefined') module.exports = TaskState;
