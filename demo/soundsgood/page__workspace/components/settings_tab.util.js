class SettingsTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.userPreferenceStoreData];
    }

    static fromDeps([preference], params) {
        return new SettingsTabGuard({ summaryLaneCapacity: preference.summaryLaneCapacity, promptFile: preference.promptFile });
    }
}
