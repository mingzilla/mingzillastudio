class TaskTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.taskStoreData, centralStoreData.itemStoreData, centralStoreData.taskEditorDataEntries];
    }

    static fromDeps([taskStoreData, itemStoreData, entries], params) {
        const id = TabId.entityIdOf(params.tabId);
        return new TaskTabGuard({ task: taskStoreData.tasks.find((each) => each.id === id) || null, jobs: taskStoreData.jobs, items: itemStoreData.items, entry: entries.entries[params.tabId] || null });
    }
}

class TaskTabDataMirror extends DataMirror {
    static from(guard) {
        const task = guard.task;
        const jobs = guard.jobs.filter((job) => job.taskId === task.id);
        const state = TaskState.stateOf(task, jobs, guard.items);
        const items = guard.items.filter((item) => task.itemIds.includes(item.id));
        const locked = StageRules.lockedStages(items);
        const stageValues = [...new Set([...(guard.entry ? guard.entry.stageValues : task.stageValues), ...locked])].filter((stage) => StageRules.ORDER.includes(stage));
        return new TaskTabDataMirror({
            state,
            stateLabel: state.toLowerCase().replace('_', ' '),
            itemsLeft: TaskState.itemsLeft(task, guard.items).length,
            isConsolidate: task.stageValues.includes('CONSOLIDATE'),
            items: items.map((item) => ({ id: item.id, name: item.name, state: ItemMarks.stateOf(item).toLowerCase() })),
            locked,
            stageValues,
            canProceed: StageRules.canProceed(items, stageValues) && StageRules.jobCount(items, stageValues) > 0,
            warning: TaskState.pauseWarning(jobs, guard.jobs),
        });
    }
}
