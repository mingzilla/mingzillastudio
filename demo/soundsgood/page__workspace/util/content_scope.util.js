// What the content filter shows. An item is unfinished when it has no raw file or no summary, when its summary is stale, or when a job for it is in the list.
// A note day file is unfinished while it has a note after the consolidated mark.
class ContentScope {
    static activeItemIds(jobs) {
        return new Set(jobs.map((job) => job.itemId));
    }

    static isUnfinished(item, shape, activeIds) {
        if (shape === 'NOTES') return item.notes.some((note) => !note.consolidated);
        return !item.hasRaw || !item.hasSummary || item.stale || activeIds.has(item.id);
    }

    static matches(item, shape, content, activeIds) {
        if (content === 'ALL') return true;
        return ContentScope.isUnfinished(item, shape, activeIds) === (content === 'UNFINISHED');
    }

    // The sections of the list: the shown items of each group of the shape; a group with none is left out.
    // Months (meetings, notes) are newest first.
    static sections(groups, items, shape, content, activeIds) {
        const own = groups.filter((group) => group.shape === shape);
        const ordered = shape === 'MEETINGS' || shape === 'NOTES' ? [...own].sort((a, b) => b.name.localeCompare(a.name)) : own;
        return ordered
            .map((group) => ({ group, items: items.filter((item) => item.groupId === group.id && ContentScope.matches(item, shape, content, activeIds)) }))
            .filter((section) => section.items.length > 0);
    }
}

if (typeof module !== 'undefined') module.exports = ContentScope;
