class UrlTaskTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.taskEditorDataEntries, centralStoreData.groupStoreData];
    }

    static fromDeps([entries, groupStoreData], params) {
        return new UrlTaskTabGuard({ entry: entries.entries[params.tabId] || null, groups: groupStoreData.groups });
    }
}

class UrlTaskTabDataMirror extends DataMirror {
    static HINT = { PLAYLIST: 'one URL: a playlist, a course, or one video of it', ITEM: 'one URL for each item' };

    static from(guard) {
        const entry = guard.entry;
        const kind = NewTaskKind.of(entry.kind);
        const urls = PlanTable.parseUrls(entry.urlText);
        return new UrlTaskTabDataMirror({
            title: kind.label,
            urlTitle: kind.mode === 'PLAYLIST' ? 'Playlist URL' : 'Item URLs',
            urlHint: UrlTaskTabDataMirror.HINT[kind.mode],
            urlCount: urls.length,
            canTest: urls.length > 0 && !entry.testing,
            canProceed: PlanTable.canProceed(entry.urlText, entry.planRows, entry.auto, entry.tested),
            groups: PlanTable.groupsOf(entry.planRows),
            addCount: PlanTable.added(entry.planRows).length,
            existingGroups: guard.groups,
        });
    }
}
