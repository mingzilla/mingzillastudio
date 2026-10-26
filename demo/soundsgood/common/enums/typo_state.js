class TypoState extends EnumValue {
    static UNRESOLVED = new TypoState('UNRESOLVED', 'unresolved');
    static APPROVED = new TypoState('APPROVED', 'approved');
    static REJECTED = new TypoState('REJECTED', 'rejected');
    static ALL = EnumValue.define([TypoState.UNRESOLVED, TypoState.APPROVED, TypoState.REJECTED]);

    static of(raw) {
        return EnumValue.find(TypoState.ALL, raw);
    }
}

if (typeof module !== 'undefined') module.exports = TypoState;
