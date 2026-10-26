function TabStripComp({ tabs, onSelect, onClose, onMove = () => undefined, onPickMenu = () => undefined }) {
    const [dragged, setDragged] = React.useState('');
    const [mark, setMark] = React.useState(null);
    const clear = () => {
        setDragged('');
        setMark(null);
    };
    const over = (event, tab) => {
        if (dragged === '' || dragged === tab.id) return;
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        const after = event.clientX > rect.left + rect.width / 2;
        if (mark === null || mark.id !== tab.id || mark.after !== after) setMark({ id: tab.id, after });
    };
    const drop = (event, tab) => {
        if (dragged === '') return;
        event.preventDefault();
        if (mark !== null) onMove(dragged, tab.id, mark.after);
        clear();
    };
    const classes = (tab) => ['tab-strip__tab', tab.active ? 'tab-strip__tab--active' : '', mark && mark.id === tab.id ? (mark.after ? 'tab-strip__tab--drop-after' : 'tab-strip__tab--drop-before') : '', dragged === tab.id ? 'tab-strip__tab--dragged' : ''].filter(Boolean).join(' ');
    return html`<div className="tab-strip" role="tablist">
        ${tabs.map((tab) => html`<div key=${tab.id} role="tab" className=${classes(tab)} draggable="true" onClick=${() => onSelect(tab.id)}
            onDragStart=${(event) => { event.dataTransfer.setData('text/plain', `tab:${tab.id}`); setDragged(tab.id); }} onDragEnd=${clear} onDragOver=${(event) => over(event, tab)} onDrop=${(event) => drop(event, tab)}>
            <${MenuComp} items=${tab.menu} onPick=${(action) => onPickMenu(tab.id, action)} trigger=${tab.icon} title=${tab.kindLabel} className="tab-strip__icon" triggerClassName="tab-strip__icon-button" />
            <span className=${tab.isNew ? 'tab-strip__title tab-strip__title--new' : 'tab-strip__title'}>${tab.title}</span>
            <button className=${tab.dirty ? 'tab-strip__close tab-strip__close--dirty' : 'tab-strip__close'} title="Close" onClick=${(event) => { event.stopPropagation(); onClose(tab.id); }}>${tab.dirty ? '●' : '×'}</button>
        </div>`)}
    </div>`;
}
