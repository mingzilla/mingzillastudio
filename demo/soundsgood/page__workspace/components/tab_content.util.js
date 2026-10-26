class TabContentGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.workspaceStoreData.activeItems, centralStoreData.userPreferenceStoreData];
    }

    static fromDeps([activeItems, preference], params) {
        return new TabContentGuard({ activeTabId: activeItems.activeTabId, openTabIds: preference.openTabIds });
    }
}
