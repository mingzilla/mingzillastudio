class VoiceTypoService {
    async approve(id, suggested) {
        await VoiceTypoApi.resolve(id, 'APPROVED', suggested);
    }

    async reject(id) {
        await VoiceTypoApi.resolve(id, 'REJECTED');
    }

    // An approved entry that is removed becomes a proposal again; a rejected one is forgotten.
    async remove(typo) {
        if (typo.state === 'REJECTED') await VoiceTypoApi.remove(typo.id);
        else await VoiceTypoApi.resolve(typo.id, 'UNRESOLVED');
    }

    async edit(id, suggested) {
        await VoiceTypoApi.resolve(id, 'APPROVED', suggested);
    }
}
