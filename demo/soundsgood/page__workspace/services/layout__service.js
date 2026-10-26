// Column widths: a drag sends commands through the bridge; the width is written to the preference once, at the end.
class LayoutService {
    constructor(store) {
        this.store = store;
        this.pending = {};
    }

    static LIMITS = { list: [220, 560], jobs: [JobsView.MIN_WIDTH, 900] };

    live(column, width) {
        const [min, max] = LayoutService.LIMITS[column];
        const clamped = Math.max(min, Math.min(max, Math.round(width)));
        this.pending[column] = clamped;
        WorkspacePageBridges.columnWidth.next({ column, width: clamped });
    }

    commit(column) {
        if (this.pending[column] === undefined) return;
        this.store.patch('userPreferenceStoreData', { [`${column}Width`]: this.pending[column] });
        delete this.pending[column];
    }

    reset(column) {
        this.live(column, { list: 340, jobs: JobsView.MIN_WIDTH }[column]);
        this.commit(column);
    }
}
