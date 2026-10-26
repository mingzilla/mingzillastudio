class Shape extends EnumValue {
    constructor(value, label, folder, allLabel) {
        super(value, label);
        this.folder = folder;
        this.allLabel = allLabel;
    }

    static COURSE = new Shape('COURSE', 'Course', 'course', 'All Courses');
    static MEETINGS = new Shape('MEETINGS', 'Meetings', 'meetings', 'All Meetings');
    static VIDEOS_YOUTUBE = new Shape('VIDEOS_YOUTUBE', 'YouTube', 'videos__youtube', 'All YouTube');
    static VIDEOS_BILIBILI = new Shape('VIDEOS_BILIBILI', 'Bilibili', 'videos__bilibili', 'All Bilibili');
    static NOTES = new Shape('NOTES', 'Notes', 'notes', 'All Notes');
    static ALL = EnumValue.define([Shape.COURSE, Shape.MEETINGS, Shape.VIDEOS_YOUTUBE, Shape.VIDEOS_BILIBILI, Shape.NOTES]);

    static of(raw) {
        return EnumValue.find(Shape.ALL, raw);
    }

    static groupNoun(shape) {
        return { COURSE: 'course', MEETINGS: 'month', VIDEOS_YOUTUBE: 'creator', VIDEOS_BILIBILI: 'creator', NOTES: 'month' }[shape];
    }
}

if (typeof module !== 'undefined') module.exports = Shape;
