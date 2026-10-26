// A pop-up: a rounded box with a header bar (the title, and a cross at the top right when it can be closed), the content, and optional buttons for a decision.
// Escape and a click outside the box close it when onClose is given.
function DialogComp({ title, buttons = [], onPress = () => undefined, onClose = null, children, wide = false }) {
    React.useEffect(() => {
        if (onClose === null) return undefined;
        const onKey = (event) => event.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);
    return html`<div className="dialog" role="dialog" aria-label=${title} onMouseDown=${(event) => onClose !== null && event.target === event.currentTarget && onClose()}>
        <div className=${wide ? 'dialog__box dialog__box--wide' : 'dialog__box'}>
            <header className="dialog__header">
                <span className="dialog__title">${title}</span>
                ${onClose === null ? null : html`<button className="dialog__close" title="Close" aria-label="Close" onClick=${onClose}>${Icons.of('close', 14)}</button>`}
            </header>
            <div className="dialog__body">${children}</div>
            ${buttons.length === 0 ? null : html`<footer className="dialog__footer">
                ${buttons.map((button) => html`<button key=${button.id} className=${button.primary ? 'dialog__button dialog__button--primary' : 'dialog__button'} onClick=${() => onPress(button.id)}>${button.label}</button>`)}
            </footer>`}
        </div>
    </div>`;
}
