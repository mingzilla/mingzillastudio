// The form of one open new-task tab, or of a task tab being edited. It is kept by tab id, so a form survives a switch to another tab.
class TaskEditorData {
    constructor(fields = {}) {
        this.tabId = null;
        this.kind = null; // a NewTaskKind value
        this.stageValues = [];
        this.urlText = '';
        this.auto = false;
        this.tested = false;
        this.testing = false;
        this.planRows = [];
        this.warnings = [];
        this.inboxTickedIds = [];
        this.groupId = null; // an existing course or creator
        this.groupName = ''; // a new course or creator
        this.agreed = false;
        this.platform = 'VIDEOS_YOUTUBE';
        this.lessonId = null; // an existing lesson without a raw file
        this.title = '';
        this.date = '';
        this.time = '';
        this.text = '';
        this.url = '';
        this.noteText = '';
        Object.assign(this, fields);
    }
}

class TaskEditorDataEntries {
    constructor(fields = {}) {
        this.entries = {};
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = { TaskEditorData, TaskEditorDataEntries };
