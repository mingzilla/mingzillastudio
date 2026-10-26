// A dot for the job of an item: running is blue and fades in and out; queued is a hollow ring; needs you is amber; failed is red.
// The title has the words. The same dot is used in the list and in the jobs column.
function JobDotComp({ kind = 'running', title }) {
    return html`<span className=${`job-dot job-dot--${kind}`} title=${title}></span>`;
}
