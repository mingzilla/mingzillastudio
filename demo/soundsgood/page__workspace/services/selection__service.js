class SelectionService {
    constructor(store) {
        this.store = store;
    }

    get ticked() {
        return this.store.current.workspaceStoreData.activeItems.tickedItemIds;
    }

    toggle(itemId) {
        const next = this.ticked.includes(itemId) ? this.ticked.filter((id) => id !== itemId) : [...this.ticked, itemId];
        this.store.patchActiveItems('workspaceStoreData', { tickedItemIds: next });
    }

    // Tick or untick the rows of one group header, or all rows.
    setMany(itemIds, on) {
        const rest = this.ticked.filter((id) => !itemIds.includes(id));
        this.store.patchActiveItems('workspaceStoreData', { tickedItemIds: on ? [...rest, ...itemIds] : rest });
    }

    clear() {
        this.store.patchActiveItems('workspaceStoreData', { tickedItemIds: [] });
    }

    static toggled(ids, id) {
        return ids.includes(id) ? ids.filter((each) => each !== id) : [...ids, id];
    }

    toggleCollapsed(groupId) {
        this.store.patchActiveItems('workspaceStoreData', { collapsedGroupIds: SelectionService.toggled(this.store.current.workspaceStoreData.activeItems.collapsedGroupIds, groupId) });
    }

    toggleOpen(groupId) {
        this.store.patchActiveItems('workspaceStoreData', { expandedGroupIds: SelectionService.toggled(this.store.current.workspaceStoreData.activeItems.expandedGroupIds, groupId) });
    }

    setStage(stage, on) {
        this.store.patchActiveItems('workspaceStoreData', { stageValues: StageRules.ticked(this.store.current.workspaceStoreData.activeItems.stageValues, stage, on) });
    }
}
