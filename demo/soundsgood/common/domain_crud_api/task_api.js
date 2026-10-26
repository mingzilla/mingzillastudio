class TaskApi {
    // The jobs that are done are archived on the server and are not sent.
    static async listAll() {
        return { tasks: PrototypeWorld.tasks, jobs: PrototypeWorld.activeJobs(), stats: PrototypeWorld.stats() };
    }

    // The server decides the jobs: a stage applies to the items that still need it. A job for an item and stage that is in the list already is refused.
    static async create({ name, shape, stageValues, itemIds }) {
        const taskId = PrototypeWorld.nextId('task');
        const wasEmpty = PrototypeWorld.activeJobs().length === 0;
        const jobs = [];
        let skipped = 0;
        itemIds.forEach((itemId) => {
            const item = PrototypeWorld.items.find((each) => each.id === itemId);
            PrototypeWorld.missingStages(item, stageValues).forEach((stage) => {
                if (PrototypeWorld.queued(itemId, stage)) skipped += 1;
                else jobs.push(new Job({ id: PrototypeWorld.nextId('job'), taskId, itemId, itemName: item.name, stage, state: 'READY', orderingIndex: jobs.length }));
            });
        });
        if (jobs.length === 0) return { task: null, jobs, skipped };
        const task = new Task({ id: taskId, name, shape, stageValues, itemIds, orderingIndex: PrototypeWorld.tasks.length });
        PrototypeWorld.tasks = [...PrototypeWorld.tasks, task];
        PrototypeWorld.jobs = [...PrototypeWorld.jobs, ...jobs];
        if (wasEmpty) PrototypeWorld.runStartedAt = Date.now();
        PrototypeWorld.emit();
        return { task, jobs, skipped };
    }

    // Pause: the jobs of the task are deleted. A running job stops and loses its work; what is done stays done.
    static async pause(taskId) {
        PrototypeWorld.jobs = PrototypeWorld.jobs.filter((job) => job.archived || job.taskId !== taskId);
        PrototypeWorld.emit();
    }

    // Proceed on a task that is not running: new jobs for what is missing.
    static async resume(taskId, stageValues) {
        const task = PrototypeWorld.tasks.find((each) => each.id === taskId);
        PrototypeWorld.tasks = PrototypeWorld.replaced(PrototypeWorld.tasks, taskId, Task, { stageValues });
        const added = [];
        const wasEmpty = PrototypeWorld.activeJobs().length === 0;
        let skipped = 0;
        const order = PrototypeWorld.activeJobs().filter((job) => job.taskId === taskId).length;
        task.itemIds.forEach((itemId) => {
            const item = PrototypeWorld.items.find((each) => each.id === itemId);
            PrototypeWorld.missingStages(item, stageValues).forEach((stage) => {
                if (PrototypeWorld.queued(itemId, stage)) skipped += 1;
                else added.push(new Job({ id: PrototypeWorld.nextId('job'), taskId, itemId, itemName: item.name, stage, state: 'READY', orderingIndex: order + added.length }));
            });
        });
        PrototypeWorld.jobs = [...PrototypeWorld.jobs, ...added];
        if (wasEmpty && added.length > 0) PrototypeWorld.runStartedAt = Date.now();
        PrototypeWorld.emit();
        return { added: added.length, skipped };
    }

    // Cancel deletes the job. The item stays in its task.
    static async cancelJob(jobId) {
        PrototypeWorld.jobs = PrototypeWorld.jobs.filter((job) => job.id !== jobId);
        PrototypeWorld.emit();
    }

    // Retry: the same row goes back to READY, in the same place, with one more attempt.
    static async retry(jobIds) {
        PrototypeWorld.jobs = PrototypeWorld.jobs.map((job) => (jobIds.includes(job.id) && job.state === 'FAILED' ? new Job({ ...job, state: 'READY', progress: 0, message: null, attempts: job.attempts + 1 }) : job));
        PrototypeWorld.emit();
    }

    static async reorderTasks(orderedIds) {
        PrototypeWorld.tasks = PrototypeWorld.tasks.map((task) => (orderedIds.includes(task.id) ? new Task({ ...task, orderingIndex: orderedIds.indexOf(task.id) }) : task));
        PrototypeWorld.emit();
    }

    static watch(fn) {
        return PrototypeWorld.watch(fn);
    }
}
