class VoiceTypoApi {
    static async list() {
        return PrototypeWorld.typos;
    }

    // state: APPROVED | REJECTED | UNRESOLVED (a removed approved entry becomes a proposal again, a removed rejected one is forgotten)
    static async resolve(id, state, suggested) {
        PrototypeWorld.typos = PrototypeWorld.replaced(PrototypeWorld.typos, id, VoiceTypo, suggested === undefined ? { state } : { state, suggested });
        PrototypeWorld.emit();
    }

    static async remove(id) {
        PrototypeWorld.typos = PrototypeWorld.typos.filter((typo) => typo.id !== id);
        PrototypeWorld.emit();
    }
}
