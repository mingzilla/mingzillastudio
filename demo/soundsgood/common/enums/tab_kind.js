class TabKind extends EnumValue {
    static ITEM = new TabKind('ITEM', 'Item');
    static TASK = new TabKind('TASK', 'Task');
    static NEW_TASK = new TabKind('NEW_TASK', 'New task');
    static NEW_NOTE = new TabKind('NEW_NOTE', 'Notes');
    static TOPIC = new TabKind('TOPIC', 'Topic');
    static VOICE_TYPOS = new TabKind('VOICE_TYPOS', 'Voice typos');
    static SETTINGS = new TabKind('SETTINGS', 'Settings');
    static ALL = EnumValue.define([TabKind.ITEM, TabKind.TASK, TabKind.NEW_TASK, TabKind.NEW_NOTE, TabKind.TOPIC, TabKind.VOICE_TYPOS, TabKind.SETTINGS]);

    static of(raw) {
        return EnumValue.find(TabKind.ALL, raw);
    }
}

if (typeof module !== 'undefined') module.exports = TabKind;
