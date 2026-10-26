// A consolidated topic to read. A draft merges into main; a topic in main can be moved to superseded.
function TopicTabComp({ context, tabId }) {
    const guard = useGuard(context, TopicTabGuard, null, { tabId });
    if (guard === null) return null;
    if (guard.topic === null) return html`<div className="app__placeholder">This topic no longer exists.</div>`;
    const { topic } = guard;
    const { topic: topicService } = context.services;
    return html`<div className="tab-body">
        <div className="task-tab__head">
            <h2 className="task-tab__title">${String(topic.number).padStart(5, '0')}__${topic.name}</h2>
            <span className="badge">${TopicFolder.of(topic.folder).label}</span>
            ${topic.folder === 'DRAFT' ? html`<button className="button button--primary" onClick=${() => topicService.merge(topic)}>Merge into main</button>` : null}
            ${topic.folder === 'MAIN' ? html`<button className="button" onClick=${() => topicService.drop(topic)}>Move to superseded</button>` : null}
        </div>
        <pre className="content-text">${topic.body}</pre>
    </div>`;
}
