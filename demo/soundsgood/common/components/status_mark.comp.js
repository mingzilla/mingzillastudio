// A small round mark: filled when on. The three marks of an item are meta, raw and summary.
function StatusMarkComp({ on, title, tone = 'ok' }) {
    return html`<span className=${on ? `status-mark status-mark--on status-mark--${tone}` : 'status-mark'} title=${title}></span>`;
}
