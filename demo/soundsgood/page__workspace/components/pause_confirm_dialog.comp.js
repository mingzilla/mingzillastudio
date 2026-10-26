// Pause and Edit stop the running jobs of a task; their work is lost. The user confirms when a job runs.
function PauseConfirmDialogComp({ text, actionLabel, onConfirm, onCancel }) {
    return html`<${DialogComp} title=${actionLabel} onClose=${onCancel} buttons=${[{ id: 'cancel', label: 'Cancel' }, { id: 'confirm', label: actionLabel, primary: true }]} onPress=${(id) => (id === 'confirm' ? onConfirm() : onCancel())}>
        <div>${text}</div>
    <//>`;
}
