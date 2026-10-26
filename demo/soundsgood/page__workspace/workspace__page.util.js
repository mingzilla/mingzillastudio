class WorkspacePageGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.userPreferenceStoreData, centralStoreData.workspaceStoreData.activeItems];
    }

    static fromDeps([preference, activeItems], params) {
        return new WorkspacePageGuard({
            listOpen: preference.listOpen,
            jobsOpen: preference.jobsOpen,
            listWidth: preference.listWidth,
            jobsWidth: preference.jobsWidth,
        });
    }
}
