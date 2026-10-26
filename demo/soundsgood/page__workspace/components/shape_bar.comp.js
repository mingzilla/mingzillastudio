function ShapeBarComp({ context }) {
    const guard = useGuard(context, ShapeBarGuard, null, {});
    const mirror = React.useMemo(() => (guard ? ShapeBarDataMirror.from(guard) : null), [guard]);
    if (guard === null) return null;
    const { navigation } = context.services;
    const pick = (id) => (id === TabId.VOICE_TYPOS || id === TabId.SETTINGS ? navigation.openTab(id) : navigation.pickShape(id));
    return html`<${ActivityBarComp} items=${mirror.items} bottomItems=${mirror.bottomItems} onPick=${pick} />`;
}
