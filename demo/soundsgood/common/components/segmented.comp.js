// One choice among a few: `[Unfinished] [Finished] [All]`.
function SegmentedComp({ options, activeId, onPick }) {
    return html`<div className="segmented" role="radiogroup">
        ${options.map((option) => html`<button key=${option.id} role="radio" aria-checked=${option.id === activeId} className=${option.id === activeId ? 'segmented__option segmented__option--active' : 'segmented__option'} onClick=${() => onPick(option.id)}>${option.label}</button>`)}
    </div>`;
}
