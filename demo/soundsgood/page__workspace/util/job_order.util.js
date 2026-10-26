// Reorder: the user drags the header row of a task table. A running job keeps running when its table goes down.
class JobOrder {
    static moved(list, fromId, toId, after) {
        const from = list.find((each) => each.id === fromId);
        const to = list.find((each) => each.id === toId);
        if (!from || !to || fromId === toId) return list;
        const rest = list.filter((each) => each.id !== fromId);
        const at = rest.findIndex((each) => each.id === toId) + (after ? 1 : 0);
        return [...rest.slice(0, at), from, ...rest.slice(at)];
    }

    static reindexed(list) {
        return list.map((each, index) => (each.orderingIndex === index ? each : { ...each, orderingIndex: index }));
    }

    static sorted(list) {
        return [...list].sort((a, b) => a.orderingIndex - b.orderingIndex);
    }

    static moveTask(tasks, fromId, toId, after) {
        return JobOrder.reindexed(JobOrder.moved(JobOrder.sorted(tasks), fromId, toId, after));
    }
}

if (typeof module !== 'undefined') module.exports = JobOrder;
