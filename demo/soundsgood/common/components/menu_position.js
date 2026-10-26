class MenuPosition {
    static ITEM_HEIGHT = 26;
    static PADDING = 8;
    static MIN_WIDTH = 200;

    static heightOf(itemCount) {
        return itemCount * MenuPosition.ITEM_HEIGHT + MenuPosition.PADDING;
    }

    static of(rect, itemCount, viewport) {
        const below = rect.bottom + MenuPosition.heightOf(itemCount) <= viewport.height || rect.top < MenuPosition.heightOf(itemCount);
        const vertical = below ? { top: rect.bottom } : { bottom: viewport.height - rect.top };
        const horizontal = rect.right - MenuPosition.MIN_WIDTH >= 0 ? { right: viewport.width - rect.right } : { left: rect.left };
        return { position: 'fixed', ...vertical, ...horizontal };
    }
}

if (typeof module !== 'undefined') module.exports = MenuPosition;
