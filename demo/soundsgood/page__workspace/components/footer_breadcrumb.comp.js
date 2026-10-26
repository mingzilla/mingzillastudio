// The footer: `Soundsgood - <breadcrumb>` for the active tab, and nothing else. The right side is kept free.
function FooterBreadcrumbComp({ context }) {
    const guard = useGuard(context, FooterBreadcrumbGuard, null, {});
    const mirror = React.useMemo(() => (guard ? FooterBreadcrumbDataMirror.from(guard) : null), [guard]);
    if (guard === null) return null;
    return html`<footer className="status-bar">
        <span className="status-bar__path">Soundsgood -\u00a0${mirror.steps.map((step, index) => html`<span key=${index} className="status-bar__step">${index > 0 ? html`<span className="status-bar__sep">›</span>` : null}${WorkspaceIcons.of(step.icon, 12)}${step.label}</span>`)}</span>
    </footer>`;
}
