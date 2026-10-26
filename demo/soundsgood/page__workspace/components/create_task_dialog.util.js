class CreateTaskDialogGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.workspaceStoreData.activeItems, centralStoreData.inboxStoreData];
    }

    static fromDeps([activeItems, inboxStoreData], params) {
        return new CreateTaskDialogGuard({ open: activeItems.createTaskOpen, fileCount: inboxStoreData.files.length });
    }
}

class CreateTaskDialogDataMirror extends DataMirror {
    static from(guard) {
        const cell = (kind, label, extra = {}) => ({ kind, label, ...extra });
        return new CreateTaskDialogDataMirror({
            rows: [
                { label: 'Course', icon: NewTaskKind.COURSE_TEXT.icon, cells: [cell('COURSE_TEXT', 'save text'), cell('COURSE_PLAYLIST', 'download playlist'), cell('COURSE_ITEM', 'download item')] },
                { label: 'Video', icon: NewTaskKind.VIDEO_TEXT.icon, cells: [cell('VIDEO_TEXT', 'save text'), cell('VIDEO_PLAYLIST', 'download playlist'), cell('VIDEO_ITEM', 'download item')] },
                { label: 'Meeting', icon: NewTaskKind.MEETING_TEXT.icon, cells: [cell('MEETING_TEXT', 'save text'), cell('MEETING_AUDIO', guard.fileCount > 0 ? `convert audio to text (${guard.fileCount})` : 'convert audio to text', { span: 2, disabled: guard.fileCount === 0, title: guard.fileCount === 0 ? 'The inbox is empty' : 'Convert the files of the inbox' })] },
                { label: 'Note', icon: 'NOTES', cells: [cell('NEW_NOTE', 'save notes'), null, null] },
            ],
        });
    }
}
