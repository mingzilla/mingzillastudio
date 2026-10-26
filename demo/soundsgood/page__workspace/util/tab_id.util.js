// A tab id is built from its kind. Item, task and topic tabs end with the id of what they show. A new-task tab ends with its kind.
class TabId {
    static SETTINGS = 'settings';
    static VOICE_TYPOS = 'voice-typos';
    static NEW_NOTE = 'note-new';

    static item(id) {
        return `item-${id}`;
    }

    static task(id) {
        return `task-${id}`;
    }

    static topic(id) {
        return `topic-${id}`;
    }

    static newTask(kind) {
        return `task-new-${kind.toLowerCase().replace(/_/g, '-')}`;
    }

    static newTaskKindOf(tabId) {
        return tabId.slice('task-new-'.length).toUpperCase().replace(/-/g, '_');
    }

    static kindOf(tabId) {
        if (tabId === TabId.SETTINGS) return 'SETTINGS';
        if (tabId === TabId.VOICE_TYPOS) return 'VOICE_TYPOS';
        if (tabId === TabId.NEW_NOTE) return 'NEW_NOTE';
        if (tabId.startsWith('task-new-')) return 'NEW_TASK';
        if (tabId.startsWith('item-')) return 'ITEM';
        if (tabId.startsWith('task-')) return 'TASK';
        if (tabId.startsWith('topic-')) return 'TOPIC';
        return 'SETTINGS';
    }

    static entityIdOf(tabId) {
        return Number(tabId.slice(tabId.lastIndexOf('-') + 1));
    }

    // A new tab is not saved in the open-tabs list.
    static isNew(tabId) {
        return tabId.startsWith('task-new-') || tabId === TabId.NEW_NOTE;
    }
}

if (typeof module !== 'undefined') module.exports = TabId;
