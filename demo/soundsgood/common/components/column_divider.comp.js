// The drag handle between columns. side = the edge of the column it sits on. It reports the new width while the pointer moves and again at the end.
function ColumnDividerComp({ side = 'right', onResize, onCommit, onReset }) {
    const start = (event) => {
        event.preventDefault();
        const rect = event.currentTarget.parentElement.getBoundingClientRect();
        const move = (moveEvent) => onResize(side === 'right' ? moveEvent.clientX - rect.left : rect.right - moveEvent.clientX);
        const end = () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
            onCommit();
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
    };
    return html`<div className=${`column-divider column-divider--${side}`} title="Drag to resize, double-click to reset" onMouseDown=${start} onDoubleClick=${onReset} />`;
}
