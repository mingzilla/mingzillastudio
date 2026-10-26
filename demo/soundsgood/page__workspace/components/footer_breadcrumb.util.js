class FooterBreadcrumbGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.workspaceStoreData.activeItems, centralStoreData.groupStoreData, centralStoreData.itemStoreData, centralStoreData.taskStoreData, centralStoreData.topicStoreData];
    }

    static fromDeps([activeItems, groupStoreData, itemStoreData, taskStoreData, topicStoreData], params) {
        return new FooterBreadcrumbGuard({ activeTabId: activeItems.activeTabId, shape: activeItems.shape, groups: groupStoreData.groups, items: itemStoreData.items, tasks: taskStoreData.tasks, topics: topicStoreData.topics });
    }
}

class FooterBreadcrumbDataMirror extends DataMirror {
    static from(guard) {
        const kind = guard.activeTabId === '' ? 'NONE' : TabId.kindOf(guard.activeTabId);
        const id = guard.activeTabId === '' ? null : TabId.entityIdOf(guard.activeTabId);
        const item = kind === 'ITEM' ? guard.items.find((each) => each.id === id) : null;
        const group = item ? guard.groups.find((each) => each.id === item.groupId) : null;
        const shape = Shape.of(group ? group.shape : guard.shape);
        const topic = kind === 'TOPIC' ? guard.topics.find((each) => each.id === id) : null;
        const steps = Breadcrumb.steps({ kind, shape: kind === 'NONE' || kind === 'ITEM' ? shape : null, group, item, task: kind === 'TASK' ? guard.tasks.find((each) => each.id === id) : null, topic: topic && { ...topic, folderLabel: TopicFolder.of(topic.folder).label }, newTaskTitle: kind === 'NEW_TASK' ? NewTaskKind.of(TabId.newTaskKindOf(guard.activeTabId)).label : null });
        return new FooterBreadcrumbDataMirror({ steps: steps.map((step) => ({ icon: step.icon, label: step.label })) });
    }
}
