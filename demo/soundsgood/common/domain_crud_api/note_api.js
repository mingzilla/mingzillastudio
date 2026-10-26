class NoteApi {
    // Save notes: the text is added at the end of the day file of today, as a new H2 note. It is always after the consolidated mark.
    static async save(text) {
        const { date, time } = DateText.now();
        const group = PrototypeWorld.groupFor('NOTES', date.slice(0, 6), date.slice(0, 6));
        const block = `## ${time}\n${text}`;
        const day = PrototypeWorld.items.find((item) => item.groupId === group.id && item.name === date);
        if (day) PrototypeWorld.updateItem(day.id, { rawText: `${day.rawText}\n\n${block}` });
        else PrototypeWorld.items = [...PrototypeWorld.items, new Item({ id: PrototypeWorld.nextId('item'), groupId: group.id, name: date, key: `day:${date}`, title: `Notes of ${date}`, hasRaw: true, rawText: block })];
        PrototypeWorld.emit();
    }

    // Edit an unconsolidated note in place: its id and place stay. A consolidated note is refused.
    static async update(itemId, noteId, text) {
        const item = PrototypeWorld.items.find((each) => each.id === itemId);
        const notes = PrototypeWorld.notesOf(item);
        const note = notes.find((each) => each.id === noteId);
        if (!note || note.consolidated) return false;
        PrototypeWorld.updateItem(itemId, { rawText: PrototypeWorld.rawOf(notes.map((each) => (each.id === noteId ? { ...each, text } : each))) });
        PrototypeWorld.emit();
        return true;
    }
}
