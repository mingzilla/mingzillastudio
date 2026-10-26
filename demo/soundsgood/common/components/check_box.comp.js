function CheckBoxComp({ label, checked, disabled = false, onChange, title }) {
    return html`<label className=${disabled ? 'check-box check-box--disabled' : 'check-box'} title=${title}>
        <input type="checkbox" checked=${checked} disabled=${disabled} onChange=${(event) => onChange(event.target.checked)} />
        <span className="check-box__label">${label}</span>
    </label>`;
}
