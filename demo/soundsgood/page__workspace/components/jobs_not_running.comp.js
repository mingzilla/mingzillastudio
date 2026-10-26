// The tasks that do not run: no jobs, work left. A click opens the task tab to view or edit.
function JobsNotRunningComp({ tasks, onOpen }) {
    if (tasks.length === 0) return null;
    return html`<section className="jobs-not-running">
        <h3 className="jobs-section__title">Not running</h3>
        ${tasks.map((task) => html`<button key=${task.id} className="jobs-not-running__task" onClick=${() => onOpen(task.id)}><span>${task.name}</span><span className="task-row__count">${task.left} left</span></button>`)}
    </section>`;
}
