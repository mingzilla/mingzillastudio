class ItemApi {
    static async listAll() {
        return PrototypeWorld.items;
    }

    static async get(id) {
        return PrototypeWorld.items.find((item) => item.id === id) || null;
    }

    // Save text: the text becomes the raw file of an item. The key of a new item is the hash of the text; a text that is stored already is skipped.
    // kind: COURSE (a lesson without a raw file, or a new lesson) | VIDEO (a creator) | MEETING (the month of the date)
    static async saveText({ subject, shape, groupId, groupName, lessonId, title, date, time, text }) {
        const key = `text:${PrototypeWorld.hashOf(text)}`;
        const stored = PrototypeWorld.items.find((item) => item.key === key);
        if (stored) return { item: stored, skipped: true };
        const known = groupId === null ? null : PrototypeWorld.groups.find((group) => group.id === groupId);
        let group;
        if (subject === 'MEETING') group = PrototypeWorld.groupFor('MEETINGS', date.slice(0, 6), date.slice(0, 6));
        else group = known || PrototypeWorld.groupFor(subject === 'COURSE' ? 'COURSE' : shape, NameNormalize.of(groupName), groupName);
        if (subject === 'COURSE' && lessonId !== null) {
            PrototypeWorld.updateItem(lessonId, { hasRaw: true, rawText: text });
            PrototypeWorld.emit();
            return { item: PrototypeWorld.items.find((each) => each.id === lessonId), skipped: false };
        }
        const name = subject === 'COURSE' ? PlanApi.nextLessonName(group, title) : subject === 'MEETING' ? NameNormalize.stem(`${date}_${time}`, title) : NameNormalize.stem(date, title);
        const item = new Item({ id: PrototypeWorld.nextId('item'), groupId: group.id, name, key, title, hasRaw: true, rawText: text });
        PrototypeWorld.items = [...PrototypeWorld.items, item];
        PrototypeWorld.emit();
        return { item, skipped: false };
    }
}
