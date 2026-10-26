// The react adapter: layers 1-2 as a hook. Needs React 18 and ChangeDetection (change_detection.js).
// context = { store } as in vanilla_lifecycle.js. The hook subscribes to the store and returns the same guard object while no field differs.
// useMemo over the guard is layer 3, JSX is layer 4. React unmounts a component and its children when its guard is null or the parent stops rendering it.
// A command bridge is a useEffect that subscribes and returns the unsubscribe.

function useGuard(context, guardClass, tempData, params) {
    const held = React.useRef(null);
    const { store } = context;
    const subscribe = React.useCallback((onChange) => {
        const subscription = store.subscribe(onChange);
        return () => subscription.unsubscribe();
    }, [store]);
    const getSnapshot = () => {
        const deps = guardClass.getDataDeps(store.current, tempData, params);
        if (!ChangeDetection.ready(deps)) {
            held.current = null;
            return null;
        }
        const next = guardClass.fromDeps(deps, params);
        if (held.current !== null && !ChangeDetection.fieldsChanged(held.current, next)) return held.current;
        held.current = next;
        return next;
    };
    return React.useSyncExternalStore(subscribe, getSnapshot);
}

if (typeof module !== 'undefined') module.exports = useGuard;
