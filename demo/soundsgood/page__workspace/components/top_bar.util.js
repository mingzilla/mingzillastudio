class TopBarGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.workspaceStoreData.activeItems, centralStoreData.userPreferenceStoreData, centralStoreData.taskStoreData, centralStoreData.inboxStoreData];
    }

    static fromDeps([activeItems, preference, taskStoreData, inboxStoreData], params) {
        return new TopBarGuard({ content: activeItems.content, jobsOpen: preference.jobsOpen, jobs: taskStoreData.jobs, files: inboxStoreData.files });
    }
}

class TopBarDataMirror extends DataMirror {
    static from(guard) {
        return new TopBarDataMirror({
            contentOptions: ContentFilter.VALUES.map((each) => ({ id: each.value, label: each.label })),
            jobCount: guard.jobs.length,
            attention: guard.jobs.some((job) => job.state === 'FAILED' || job.state === 'NEEDS_YOU'),
            inboxDot: guard.files.length > 0,
            jobsOpen: guard.jobsOpen,
        });
    }
}
