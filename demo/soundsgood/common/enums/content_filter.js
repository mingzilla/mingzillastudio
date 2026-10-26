// What the 1st and 2nd columns show. The app is about unfinished work; finished work is read-only.
class ContentFilter extends EnumValue {
    static UNFINISHED = new ContentFilter('UNFINISHED', 'Unfinished');
    static FINISHED = new ContentFilter('FINISHED', 'Finished');
    static ALL = new ContentFilter('ALL', 'All');
    static VALUES = EnumValue.define([ContentFilter.UNFINISHED, ContentFilter.FINISHED, ContentFilter.ALL]);

    static of(raw) {
        return EnumValue.find(ContentFilter.VALUES, raw);
    }
}

if (typeof module !== 'undefined') module.exports = ContentFilter;
