class MeetingAudioTaskTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.inboxStoreData, centralStoreData.taskEditorDataEntries];
    }

    static fromDeps([inboxStoreData, entries], params) {
        return new MeetingAudioTaskTabGuard({ files: inboxStoreData.files, entry: entries.entries[params.tabId] || null });
    }
}

class MeetingAudioTaskTabDataMirror extends DataMirror {
    static from(guard) {
        const ticked = guard.entry.inboxTickedIds;
        return new MeetingAudioTaskTabDataMirror({
            rows: guard.files.map((file) => ({ id: file.id, name: file.name, date: file.date, sizeMb: file.sizeMb, ticked: ticked.includes(file.id), month: file.date.slice(0, 6) })),
            allTicked: guard.files.length > 0 && guard.files.every((file) => ticked.includes(file.id)),
            canProceed: guard.files.some((file) => ticked.includes(file.id)),
        });
    }
}
