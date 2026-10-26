class Icons {
    static GEAR = 'M10.87 4.89 L11.11 2.54 L12.89 2.54 L13.13 4.89 L16.23 6.18 L18.06 4.68 L19.32 5.94 L17.82 7.77 L19.11 10.87 L21.46 11.11 L21.46 12.89 L19.11 13.13 L17.82 16.23 L19.32 18.06 L18.06 19.32 L16.23 17.82 L13.13 19.11 L12.89 21.46 L11.11 21.46 L10.87 19.11 L7.77 17.82 L5.94 19.32 L4.68 18.06 L6.18 16.23 L4.89 13.13 L2.54 12.89 L2.54 11.11 L4.89 10.87 L6.18 7.77 L4.68 5.94 L5.94 4.68 L7.77 6.18z';

    static svg(children, size = 16, strokeWidth = 1.5) {
        return html`<svg viewBox="0 0 24 24" width=${size} height=${size} fill="none" stroke="currentColor" strokeWidth=${strokeWidth} strokeLinecap="round" strokeLinejoin="round">${children}</svg>`;
    }

    // generic: collapse, folder, file, settings, more, save, undo, redo, duplicate, refresh, edit, plus, close, check
    static of(id, size = 16) {
        if (id === 'collapse') return Icons.svg(html`<path d="M7 4.5l5 5 5-5" /><path d="M7 19.5l5-5 5 5" />`, size);
        if (id === 'folder') return Icons.svg(html`<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />`, size);
        if (id === 'file') return Icons.svg(html`<path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" />`, size);
        if (id === 'settings') return Icons.svg(html`<path d=${Icons.GEAR} /><circle cx="12" cy="12" r="3" />`, size);
        if (id === 'more') return Icons.svg(html`<circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="18" cy="12" r="1" />`, size);
        if (id === 'save') return Icons.svg(html`<path d="M5 4h11l3 3v13H5z" /><path d="M8 4v5h7V4M8 20v-6h8v6" />`, size);
        if (id === 'undo') return Icons.svg(html`<path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" />`, size);
        if (id === 'redo') return Icons.svg(html`<path d="M15 14l5-5-5-5" /><path d="M20 9H10a6 6 0 0 0 0 12h3" />`, size);
        if (id === 'duplicate') return Icons.svg(html`<rect x="9" y="9" width="11" height="11" rx="1" /><path d="M5 15V5a1 1 0 0 1 1-1h10" />`, size);
        if (id === 'refresh') return Icons.svg(html`<path d="M20 12a8 8 0 1 1-2.5-5.8" /><path d="M20 4v5h-5" />`, size);
        if (id === 'edit') return Icons.svg(html`<path d="M4 20l1-4L16 5l3 3L8 19z" /><path d="M14 7l3 3" />`, size);
        if (id === 'plus') return Icons.svg(html`<path d="M12 5v14M5 12h14" />`, size);
        if (id === 'close') return Icons.svg(html`<path d="M6 6l12 12M18 6L6 18" />`, size);
        if (id === 'check') return Icons.svg(html`<path d="M5 12.5l4.5 4.5L19 7.5" />`, size);
        return Icons.svg(html`<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />`, size);
    }
}
