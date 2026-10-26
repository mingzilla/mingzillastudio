class TextTaskTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.taskEditorDataEntries, centralStoreData.groupStoreData, centralStoreData.itemStoreData];
    }

    static fromDeps([entries, groupStoreData, itemStoreData], params) {
        return new TextTaskTabGuard({ entry: entries.entries[params.tabId] || null, groups: groupStoreData.groups, items: itemStoreData.items });
    }
}

class TextTaskTabDataMirror extends DataMirror {
    // A text needs: a group (an existing one, or a new one that is agreed to), a title (not for a lesson that exists), and the text.
    static canProceed(entry, subject) {
        if (entry.text.trim() === '') return false;
        const groupOk = entry.groupId !== null || (entry.groupName.trim() !== '' && entry.agreed);
        if (subject === 'MEETING') return entry.title.trim() !== '' && /^\d{8}$/.test(entry.date) && /^\d{6}$/.test(entry.time);
        if (subject === 'COURSE') return groupOk && (entry.lessonId !== null || entry.title.trim() !== '');
        return groupOk && entry.title.trim() !== '' && /^\d{8}$/.test(entry.date);
    }

    static from(guard) {
        const entry = guard.entry;
        const kind = NewTaskKind.of(entry.kind);
        const shape = kind.subject === 'COURSE' ? 'COURSE' : entry.platform;
        return new TextTaskTabDataMirror({
            title: kind.label,
            subject: kind.subject,
            groupOptions: guard.groups.filter((group) => group.shape === shape).map((group) => ({ id: group.id, title: group.displayName || group.name })),
            lessonOptions: guard.items.filter((item) => item.groupId === entry.groupId && !item.hasRaw).map((item) => ({ id: item.id, title: item.name })),
            canProceed: TextTaskTabDataMirror.canProceed(entry, kind.subject),
        });
    }
}
