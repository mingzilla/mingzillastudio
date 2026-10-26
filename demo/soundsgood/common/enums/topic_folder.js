class TopicFolder extends EnumValue {
    static DRAFT = new TopicFolder('DRAFT', 'draft');
    static MAIN = new TopicFolder('MAIN', 'main');
    static SUPERSEDED = new TopicFolder('SUPERSEDED', 'superseded');
    static ALL = EnumValue.define([TopicFolder.DRAFT, TopicFolder.MAIN, TopicFolder.SUPERSEDED]);

    static of(raw) {
        return EnumValue.find(TopicFolder.ALL, raw);
    }
}

if (typeof module !== 'undefined') module.exports = TopicFolder;
