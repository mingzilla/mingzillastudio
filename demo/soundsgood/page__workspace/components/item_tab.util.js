class ItemTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.itemStoreData, centralStoreData.groupStoreData];
    }

    static fromDeps([itemStoreData, groupStoreData], params) {
        const item = itemStoreData.items.find((each) => each.id === TabId.entityIdOf(params.tabId));
        return new ItemTabGuard({ item: item || null, group: item ? groupStoreData.groups.find((each) => each.id === item.groupId) || null : null });
    }
}

class ItemTabDataMirror extends DataMirror {
    static from(guard) {
        const item = guard.item;
        const isNotes = guard.group !== null && guard.group.shape === 'NOTES';
        return new ItemTabDataMirror({
            isNotes,
            definition: item === null ? [] : [['name', item.name], ['title', item.title], ['key', item.key], ['source', item.source || '—'], ['group', guard.group ? guard.group.name : '—'], ['type', item.type]],
            rawState: item === null ? '' : item.hasRaw ? 'raw: transcript exists' : 'raw: no transcript yet',
            summaryState: item === null ? '' : item.hasSummary ? (item.stale ? 'summary: stale (the raw file changed)' : 'summary: exists') : 'summary: none yet',
            noteState: item === null ? '' : `${item.notes.filter((note) => !note.consolidated).length} after the consolidated mark`,
            rawText: item ? item.rawText : null,
            summaryText: item ? item.summaryText : null,
            items: item === null ? [] : [item],
            locked: item === null ? [] : StageRules.lockedStages([item]),
            finished: item !== null && StageRules.lockedStages([item]).length === StageRules.ORDER.length,
        });
    }
}
