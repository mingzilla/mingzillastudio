function SideResizeComp({ onBegin = () => undefined, onResize, onCommit = () => undefined, onReset = () => undefined }) {
    const start = (event) => {
        event.preventDefault();
        const left = event.currentTarget.parentElement.getBoundingClientRect().left;
        const move = (moveEvent) => onResize(moveEvent.clientX - left);
        const end = () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
            onCommit();
        };
        onBegin();
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
    };
    return html`<div className="side-resize" title="Drag to resize, double-click to reset" onMouseDown=${start} onDoubleClick=${onReset} />`;
}
