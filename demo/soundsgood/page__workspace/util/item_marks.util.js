class ItemMarks {
    static marksOf(item) {
        return { meta: true, raw: item.hasRaw, summary: item.hasSummary, stale: item.stale };
    }

    static stateOf(item) {
        if (item.hasSummary) return item.stale ? 'STALE' : 'SUMMARY';
        return item.hasRaw ? 'RAW' : 'META';
    }
}

if (typeof module !== 'undefined') module.exports = ItemMarks;
