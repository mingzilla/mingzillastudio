// Show Failed: the failed jobs of every task, in the same tables as the running tasks, with Retry and Retry all. A retried job keeps its place.
function JobsFailedListComp({ tables, count, onOpen, onRetry, onCancel }) {
    const noop = () => undefined;
    return html`<section className="jobs-failed">
        <div className="jobs-failed__head"><h3 className="jobs-section__title">Failed (${count})</h3><button className="button button--small jobs-failed__retry-all" disabled=${count === 0} onClick=${() => onRetry(tables.flatMap((table) => table.rows.map((row) => row.id)))}>retry all</button></div>
        ${count === 0 ? html`<div className="tree__hint">No failed job.</div>` : null}
        ${tables.map((table) => html`<${JobsTaskTableComp} key=${table.id} table=${table} onAct=${noop} onOpen=${onOpen} onCancel=${onCancel} onRetry=${onRetry} onMove=${noop} />`)}
    </section>`;
}
