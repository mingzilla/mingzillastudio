class ShapeBarGuard extends Guard {
    static getDataDeps(centralStoreData, tempData, params) {
        return [centralStoreData.workspaceStoreData.activeItems, centralStoreData.voiceTypoStoreData];
    }

    static fromDeps([activeItems, voiceTypoStoreData], params) {
        return new ShapeBarGuard({ shape: activeItems.shape, activeTabId: activeItems.activeTabId, typos: voiceTypoStoreData.typos });
    }
}

class ShapeBarDataMirror extends DataMirror {
    static from(guard) {
        const unresolved = guard.typos.filter((typo) => typo.state === 'UNRESOLVED').length;
        return new ShapeBarDataMirror({
            items: Shape.ALL.map((shape) => ({ id: shape.value, label: shape.label, icon: WorkspaceIcons.of(shape.value, 22), active: shape.value === guard.shape })),
            bottomItems: [
                { id: TabId.VOICE_TYPOS, label: 'Voice typos', icon: WorkspaceIcons.of('typos', 22), active: guard.activeTabId === TabId.VOICE_TYPOS, badge: unresolved || null },
                { id: TabId.SETTINGS, label: 'Settings', icon: Icons.of('settings', 22), active: guard.activeTabId === TabId.SETTINGS },
            ],
        });
    }
}
