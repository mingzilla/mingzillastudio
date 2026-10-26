function MenuListComp({ items, style, onPick }) {
    return html`<ul className="menu__list" style=${style}>
        ${items.map((item) => html`<li key=${item.id}><button className=${item.danger ? 'menu__item menu__item--danger' : 'menu__item'} onClick=${(event) => { event.stopPropagation(); onPick(item.id); }}>${item.label}</button></li>`)}
    </ul>`;
}

function MenuComp({ items, onPick, trigger, title, className, triggerClassName }) {
    const [style, setStyle] = React.useState(null);
    const root = React.useRef(null);
    React.useEffect(() => {
        if (style === null) return undefined;
        const close = (event) => {
            if (!root.current || !root.current.contains(event.target)) setStyle(null);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [style]);
    const toggle = (event) => {
        event.stopPropagation();
        if (style !== null || items.length === 0) {
            setStyle(null);
            return;
        }
        setStyle(MenuPosition.of(event.currentTarget.getBoundingClientRect(), items.length, { width: window.innerWidth, height: window.innerHeight }));
    };
    const pick = (id) => {
        setStyle(null);
        onPick(id);
    };
    return html`<span className=${className} ref=${root}>
        <button className=${triggerClassName} title=${title} onClick=${toggle}>${trigger}</button>
        ${style === null ? null : html`<${MenuListComp} items=${items} style=${style} onPick=${pick} />`}
    </span>`;
}

function ItemMenuComp({ items, onPick }) {
    return html`<${MenuComp} items=${items} onPick=${onPick} trigger="⋯" title="Actions" className="item-menu" triggerClassName="item-menu__button" />`;
}
