// Command bridges: a high-frequency source (a column divider being dragged) wakes only its receiver, not every component.
class WorkspacePageBridges {
    static columnWidth = new Broadcaster(); // { column: 'groups'|'items'|'jobs', width }
}
