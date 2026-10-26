function SnackbarItemComp({ item, onDismiss, infoMs = 3000 }) {
    React.useEffect(() => {
        if (!item.temporary) return undefined;
        const timer = setTimeout(() => onDismiss(item.id), infoMs);
        return () => clearTimeout(timer);
    }, [item.id, item.temporary]);
    return html`<div className=${item.temporary ? 'snackbar__item snackbar__item--info' : 'snackbar__item'}>
        <span className="snackbar__icon" aria-hidden="true">${item.temporary ? '✓' : '!'}</span>
        <div className="snackbar__text">
            <div className="snackbar__message">${item.message}</div>
            ${item.detail ? html`<pre className="snackbar__detail">${item.detail}</pre>` : null}
        </div>
        ${item.temporary ? null : html`<button className="snackbar__button" title="Copy" onClick=${() => navigator.clipboard.writeText(item.detail ? `${item.message}\n${item.detail}` : item.message)}>copy</button>`}
        <button className="snackbar__button" title="Dismiss" onClick=${() => onDismiss(item.id)}>×</button>
    </div>`;
}

function SnackbarComp({ items, onDismiss }) {
    if (items.length === 0) return null;
    return html`<div className="snackbar" role="alert">
        ${items.map((item) => html`<${SnackbarItemComp} key=${item.id} item=${item} onDismiss=${onDismiss} />`)}
    </div>`;
}
