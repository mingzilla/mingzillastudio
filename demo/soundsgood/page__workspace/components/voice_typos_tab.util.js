class VoiceTyposTabGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.voiceTypoStoreData];
    }

    static fromDeps([voiceTypoStoreData], params) {
        return new VoiceTyposTabGuard({ typos: voiceTypoStoreData.typos });
    }
}

class VoiceTyposTabDataMirror extends DataMirror {
    static from(guard, view) {
        const unresolved = guard.typos.filter((typo) => typo.state === 'UNRESOLVED');
        const resolved = guard.typos.filter((typo) => typo.state !== 'UNRESOLVED');
        return new VoiceTyposTabDataMirror({
            views: [{ id: 'unresolved', label: 'unresolved', count: unresolved.length }, { id: 'resolved', label: 'resolved', count: resolved.length }],
            rows: view === 'unresolved' ? unresolved : resolved,
        });
    }
}
