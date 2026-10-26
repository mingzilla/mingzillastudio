// The plan of a download task: a row for each item, and a group for each place the rows go to.
class PlanTable {
    static parseUrls(text) {
        return [...new Set(text.split('\n').map((line) => line.trim()).filter((line) => line !== ''))];
    }

    static added(rows) {
        return rows.filter((row) => row.action === 'ADD');
    }

    static groupsOf(rows) {
        const found = [];
        PlanTable.added(rows).forEach((row) => {
            const at = found.find((group) => group.shape === row.shape && group.name === row.goesTo);
            if (at) at.count += 1;
            else found.push({ shape: row.shape, name: row.goesTo, isNew: row.isNew, agreed: row.agreed, count: 1 });
        });
        return found;
    }

    // Every new group is agreed to, or Auto is ticked. Test comes first unless Auto.
    static canProceed(urlText, rows, auto, tested) {
        if (PlanTable.parseUrls(urlText).length === 0) return false;
        if (auto) return true;
        if (!tested) return false;
        return PlanTable.added(rows).length > 0 && PlanTable.groupsOf(rows).every((group) => !group.isNew || group.agreed);
    }

    static withRow(rows, rowId, changes) {
        return rows.map((row) => (row.id === rowId ? Object.assign(Object.create(Object.getPrototypeOf(row)), row, changes) : row));
    }

    static agreeGroup(rows, shape, name, agreed) {
        return rows.map((row) => (row.shape === shape && row.goesTo === name ? Object.assign(Object.create(Object.getPrototypeOf(row)), row, { agreed }) : row));
    }

    // A group that is renamed goes to the group of that name if it exists, otherwise it is a new group that must be agreed to.
    static renameGroup(rows, shape, from, to, existingGroups) {
        const exists = existingGroups.some((group) => group.shape === shape && group.name === NameNormalize.of(to));
        return rows.map((row) => (row.shape === shape && row.goesTo === from ? Object.assign(Object.create(Object.getPrototypeOf(row)), row, { goesTo: to, isNew: !exists, agreed: false }) : row));
    }
}

if (typeof module !== 'undefined') module.exports = PlanTable;
