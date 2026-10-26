// The footer breadcrumb: the root level of the tab, then the items of the tab.
class Breadcrumb {
    static steps({ kind, shape, group, item, task, topic, newTaskTitle }) {
        const root = shape ? { icon: shape.value, label: shape.label } : null;
        const groupStep = group && { icon: 'folder', label: group.displayName || group.name };
        if (kind === 'ITEM') return [root, groupStep, item && { icon: 'file', label: item.name }].filter(Boolean);
        if (kind === 'NEW_TASK') return [{ icon: 'tasks', label: 'Create Task' }, { icon: 'task', label: newTaskTitle }];
        if (kind === 'TASK') return [{ icon: 'tasks', label: 'Tasks' }, { icon: 'task', label: task ? task.name : 'Task' }];
        if (kind === 'NEW_NOTE') return [{ icon: 'NOTES', label: 'Notes' }, { icon: 'file', label: 'Save notes' }];
        if (kind === 'TOPIC') return [{ icon: 'NOTES', label: 'Notes' }, { icon: 'folder', label: 'Topics' }, topic && { icon: 'folder', label: topic.folderLabel }, topic && { icon: 'file', label: topic.name }].filter(Boolean);
        if (kind === 'VOICE_TYPOS') return [{ icon: 'typos', label: 'Voice typos' }];
        if (kind === 'SETTINGS') return [{ icon: 'settings', label: 'Settings' }];
        return [root, groupStep].filter(Boolean);
    }
}

if (typeof module !== 'undefined') module.exports = Breadcrumb;
