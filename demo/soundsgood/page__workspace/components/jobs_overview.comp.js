// The overview has a fixed height. With no job in the list it says so; otherwise it is a row for each lane (the name, a bar of the run, `done/total`) and one estimate for the run. Every part has a fixed width, so the bars never move.
// The bar is filled in grey for the finished jobs, then in blue for the running ones. The title of the estimate is the estimate of each lane.
function JobsOverviewComp({ idle, lanes, overall, failedCount, needsYouCount }) {
    const share = (part, total) => (total === 0 ? 0 : (part / total) * 100);
    const three = (n) => Math.min(999, n);
    const attention = [failedCount > 0 ? `${failedCount} failed` : '', needsYouCount > 0 ? `${needsYouCount} need you` : ''].filter(Boolean).join(' · ');
    return html`<section className="jobs-overview">
        <h3 className="jobs-section__title">Overview</h3>
        <div className="jobs-overview__body">
        ${idle ? html`<div className="jobs-overview__empty">Nothing is running.</div>` : html`${lanes.map((lane) => html`<div key=${lane.id} className="jobs-overview__row">
            <span className="jobs-overview__label">${lane.label}</span>
            <span className="jobs-bar" title=${lane.title}>
                <span className="jobs-bar__done" style=${{ width: `${share(lane.done, lane.total)}%` }}></span>
                <span className="jobs-bar__running" style=${{ width: `${share(lane.running, lane.total)}%`, minWidth: lane.running > 0 ? '3px' : 0 }}></span>
            </span>
            <span className="jobs-overview__count" title=${lane.title}>${three(lane.done)}/${three(lane.total)}</span>
        </div>`)}
        <div className="jobs-overview__foot">
            <span className="jobs-overview__attention">${attention}</span>
            <span className="jobs-overview__total" title=${overall.title}>${overall.text}</span>
        </div>`}
        </div>
    </section>`;
}
