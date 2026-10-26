class Stage extends EnumValue {
    constructor(value, label, order) {
        super(value, label);
        this.order = order;
    }

    static TRANSCRIBE = new Stage('TRANSCRIBE', 'transcribe', 0);
    static SUMMARISE = new Stage('SUMMARISE', 'summarise', 1);
    static CONSOLIDATE = new Stage('CONSOLIDATE', 'consolidate', 2);
    static ALL = EnumValue.define([Stage.TRANSCRIBE, Stage.SUMMARISE, Stage.CONSOLIDATE]);

    static of(raw) {
        return EnumValue.find(Stage.ALL, raw);
    }
}

if (typeof module !== 'undefined') module.exports = Stage;
