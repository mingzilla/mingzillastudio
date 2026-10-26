class NoteTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.taskEditorDataEntries];
    }

    static fromDeps([entries], params) {
        return new NoteTabGuard({ entry: entries.entries[params.tabId] || null });
    }
}
