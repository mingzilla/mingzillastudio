class VoiceTypo {
    constructor(fields = {}) {
        this.id = null;
        this.wrong = null;
        this.suggested = null;
        this.context = null;
        this.state = 'UNRESOLVED';
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = VoiceTypo;
