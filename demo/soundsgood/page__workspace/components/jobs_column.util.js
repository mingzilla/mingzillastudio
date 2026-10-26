class JobsColumnGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.taskStoreData, centralStoreData.itemStoreData, centralStoreData.userPreferenceStoreData];
    }

    static fromDeps([taskStoreData, itemStoreData, preference], params) {
        return new JobsColumnGuard({ tasks: taskStoreData.tasks, jobs: taskStoreData.jobs, stats: taskStoreData.stats, items: itemStoreData.items, summaryCapacity: preference.summaryLaneCapacity });
    }
}

class JobsColumnDataMirror extends DataMirror {
    static countsText(counts) {
        return [counts.running && `${counts.running} running`, counts.failed && `${counts.failed} failed`, counts.needsYou && `${counts.needsYou} need you`, counts.waiting && `${counts.waiting} waiting`, counts.blocked && `${counts.blocked} blocked`].filter(Boolean).join(' · ');
    }

    static from(guard) {
        const displays = JobReadiness.displays(guard.jobs, guard.items);
        const tasks = JobOrder.sorted(guard.tasks);
        const tables = tasks
            .map((task) => ({ task, jobs: guard.jobs.filter((job) => job.taskId === task.id) }))
            .filter(({ jobs }) => jobs.length > 0)
            .map(({ task, jobs }) => ({
                id: task.id,
                name: task.name,
                total: jobs.length,
                countsText: JobsColumnDataMirror.countsText(TaskState.counts(jobs.map((job) => displays.get(job.id)))),
                canEdit: !task.stageValues.includes('CONSOLIDATE'),
                showActions: true,
                warning: TaskState.pauseWarning(jobs, guard.jobs),
                ...JobsView.tableRows(jobs, displays),
            }));
        const notRunning = tasks
            .filter((task) => TaskState.stateOf(task, guard.jobs.filter((job) => job.taskId === task.id), guard.items) === 'NOT_RUNNING')
            .map((task) => ({ id: task.id, name: task.name, left: TaskState.itemsLeft(task, guard.items).length }));
        const lanes = JobsView.lanes(guard.jobs, displays, guard.stats, guard.summaryCapacity);
        return new JobsColumnDataMirror({
            idle: guard.jobs.length === 0,
            lanes,
            overall: JobsView.overall(lanes),
            tables,
            notRunning,
            failedTables: JobsView.failedTables(guard.jobs, guard.tasks, displays),
            failedCount: guard.jobs.filter((job) => job.state === 'FAILED').length,
            needsYouCount: guard.jobs.filter((job) => job.state === 'NEEDS_YOU').length,
        });
    }
}
