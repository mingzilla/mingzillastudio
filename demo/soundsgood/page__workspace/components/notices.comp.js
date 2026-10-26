function NoticesComp({ context }) {
    const guard = useGuard(context, NoticesGuard, null, {});
    if (guard === null) return null;
    return html`<${SnackbarComp} items=${guard.notices} onDismiss=${(id) => context.services.notices.dismiss(id)} />`;
}
