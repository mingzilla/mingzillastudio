// The page's own data. activeItems is what several components share: what the lists show, the chosen shape and group, the active tab, the ticked items.
class WorkspaceActiveItems {
    constructor(fields = {}) {
        this.content = 'UNFINISHED'; // UNFINISHED | FINISHED | ALL
        this.shape = 'COURSE';
        this.activeTabId = '';
        this.tickedItemIds = [];
        this.collapsedGroupIds = []; // the header rows that are closed in the Unfinished list (open at first)
        this.expandedGroupIds = []; // the folders that are open in the tree (closed at first)
        this.notesView = 'DAILY'; // DAILY | TOPICS: notes in Finished and All
        this.topicFolder = 'MAIN'; // DRAFT | MAIN | SUPERSEDED: Main is chosen each time Topics opens
        this.stageValues = [];
        this.createTaskOpen = false;
        Object.assign(this, fields);
    }
}

class WorkspaceStoreData {
    constructor(fields = {}) {
        this.activeItems = new WorkspaceActiveItems();
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = { WorkspaceActiveItems, WorkspaceStoreData };
