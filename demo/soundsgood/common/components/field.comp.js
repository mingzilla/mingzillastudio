function FieldComp({ kind, value, options, placeholder, title, errors, onCommit, onInput, disabled = false, type = 'text', autoComplete = undefined }) {
    const id = React.useId();
    const shown = kind === 'select' ? value : value ?? '';
    const invalid = errors.length > 0;
    const className = ['field', invalid ? 'field--invalid' : '', kind === 'select' ? 'field--select' : '', kind === 'textarea' ? 'field--textarea' : ''].filter(Boolean).join(' ');
    const attributes = { className: 'field__input', title, disabled, 'aria-invalid': invalid, 'aria-describedby': invalid ? id : undefined };
    const text = kind === 'textarea'
        ? html`<textarea ...${attributes} key=${shown} defaultValue=${shown} placeholder=${placeholder} spellCheck="false" onBlur=${(event) => onCommit(event.target.value)} />`
        : html`<input ...${attributes} type=${type} autoComplete=${autoComplete} key=${shown} defaultValue=${shown} placeholder=${placeholder} onInput=${onInput ? (event) => onInput(event.target.value) : undefined} onBlur=${(event) => onCommit(event.target.value)} />`;
    const control = kind === 'select'
        ? html`<select ...${attributes} value=${value} onChange=${(event) => onCommit(event.target.value)}>${options.map((option) => html`<option key=${option.value} value=${option.value}>${option.label}</option>`)}</select>`
        : text;
    return html`<div className=${className}>
        ${control}
        ${invalid ? html`<span className="field__icon" aria-hidden="true">!</span>` : null}
        ${invalid ? html`<div className="field__popover" id=${id} role="status">${errors.join(' \u00B7 ')}</div>` : null}
    </div>`;
}
