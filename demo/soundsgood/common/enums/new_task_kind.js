// The kinds of new-task tab, one cell each in the Create Task pop-up. The URL decides YouTube or Bilibili, so a video has no platform kind.
class NewTaskKind extends EnumValue {
    static SUBJECTS = { COURSE: { icon: 'COURSE' }, VIDEO: { icon: 'VIDEOS_YOUTUBE' }, MEETING: { icon: 'MEETINGS' } };
    static TAB_TITLES = { TEXT: 'text', PLAYLIST: 'list', ITEM: 'item', AUDIO: 'audio' };

    constructor(value, label, subject, mode) {
        super(value, label);
        this.subject = subject; // COURSE | VIDEO | MEETING
        this.mode = mode; // PLAYLIST | ITEM | TEXT | AUDIO
        this.tabTitle = NewTaskKind.TAB_TITLES[mode]; // the icon says the subject, so the title says only the kind
        this.icon = NewTaskKind.SUBJECTS[subject].icon; // the icon of the row of the Create Task pop-up
    }

    static COURSE_TEXT = new NewTaskKind('COURSE_TEXT', 'Save text: course', 'COURSE', 'TEXT');
    static COURSE_PLAYLIST = new NewTaskKind('COURSE_PLAYLIST', 'Download playlist: course', 'COURSE', 'PLAYLIST');
    static COURSE_ITEM = new NewTaskKind('COURSE_ITEM', 'Download item: course', 'COURSE', 'ITEM');
    static VIDEO_TEXT = new NewTaskKind('VIDEO_TEXT', 'Save text: video', 'VIDEO', 'TEXT');
    static VIDEO_PLAYLIST = new NewTaskKind('VIDEO_PLAYLIST', 'Download playlist: video', 'VIDEO', 'PLAYLIST');
    static VIDEO_ITEM = new NewTaskKind('VIDEO_ITEM', 'Download item: video', 'VIDEO', 'ITEM');
    static MEETING_TEXT = new NewTaskKind('MEETING_TEXT', 'Save text: meeting', 'MEETING', 'TEXT');
    static MEETING_AUDIO = new NewTaskKind('MEETING_AUDIO', 'Convert audio to text', 'MEETING', 'AUDIO');
    static ALL = EnumValue.define([NewTaskKind.COURSE_TEXT, NewTaskKind.COURSE_PLAYLIST, NewTaskKind.COURSE_ITEM, NewTaskKind.VIDEO_TEXT, NewTaskKind.VIDEO_PLAYLIST, NewTaskKind.VIDEO_ITEM, NewTaskKind.MEETING_TEXT, NewTaskKind.MEETING_AUDIO]);

    static of(raw) {
        return EnumValue.find(NewTaskKind.ALL, raw);
    }
}

if (typeof module !== 'undefined') module.exports = NewTaskKind;
