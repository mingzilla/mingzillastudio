class InboxApi {
    static async list() {
        return PrototypeWorld.inbox;
    }

    // Every media file is a meeting: each file is added to the meta.json of the month of its date. The jobs are made by the task.
    static async register(fileIds) {
        const files = PrototypeWorld.inbox.filter((file) => fileIds.includes(file.id));
        const itemIds = [];
        const groups = [];
        files.forEach((file) => {
            const month = file.date.slice(0, 6);
            const group = PrototypeWorld.groupFor('MEETINGS', month, month);
            if (!groups.some((each) => each.id === group.id)) groups.push({ id: group.id, name: group.name, shape: group.shape });
            const name = NameNormalize.stem(file.date, file.name.replace(/\.[a-z0-9]+$/, ''));
            const item = new Item({ id: PrototypeWorld.nextId('item'), groupId: group.id, name, key: `file:${file.name}`, title: file.name, source: file.name });
            PrototypeWorld.items = [...PrototypeWorld.items, item];
            itemIds.push(item.id);
        });
        PrototypeWorld.inbox = PrototypeWorld.inbox.filter((file) => !fileIds.includes(file.id));
        PrototypeWorld.emit();
        return { itemIds, groups };
    }
}
