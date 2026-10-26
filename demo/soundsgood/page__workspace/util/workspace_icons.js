// The icons of this app (the generic ones are in common/components/icons.js).
class WorkspaceIcons {
    static of(id, size = 16) {
        const svg = (children) => Icons.svg(children, size);
        if (id === 'COURSE') return svg(html`<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v15H5.5A1.5 1.5 0 0 0 4 20.5z" /><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H12v15h6.5a1.5 1.5 0 0 1 1.5 1.5z" />`);
        if (id === 'MEETINGS') return svg(html`<rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />`);
        if (id === 'VIDEOS_YOUTUBE') return svg(html`<rect x="3" y="6" width="18" height="12" rx="3" /><path d="M10 9.5v5l4.5-2.5z" />`);
        if (id === 'VIDEOS_BILIBILI') return svg(html`<rect x="3" y="7" width="18" height="12" rx="2" /><path d="M8 3l3 4M16 3l-3 4M8 12v2M16 12v2" />`);
        if (id === 'NOTES') return svg(html`<path d="M4 20l1-4L16 5l3 3L8 19z" /><path d="M14 7l3 3" />`);
        if (id === 'tasks' || id === 'task') return svg(html`<path d="M5 6h14M5 12h14M5 18h9" /><path d="M17 17l2 2 3-3" />`);
        if (id === 'jobs') return svg(html`<circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" />`);
        if (id === 'inbox') return svg(html`<path d="M3 13l3-8h12l3 8v6H3z" /><path d="M3 13h5l1 3h6l1-3h5" />`);
        if (id === 'typos') return svg(html`<path d="M4 7V5h16v2M12 5v14M9 19h6" />`);
        if (id === 'pause') return svg(html`<path d="M8 5v14M16 5v14" />`);
        if (id === 'play') return svg(html`<path d="M7 4l12 8-12 8z" />`);
        if (id === 'stop') return svg(html`<rect x="6" y="6" width="12" height="12" />`);
        if (id === 'retry') return Icons.of('refresh', size);
        return Icons.of(id, size);
    }
}
