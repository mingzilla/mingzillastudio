// A row of a form: the label, the field (every field has the same width and height) and an action column of the same width in every row (a button or a checkbox).
function FormRowComp({ label, children, action = null }) {
    return html`<div className="form-row">
        <label className="form-row__label">${label}</label>
        <div className="form-row__control">${children}</div>
        <div className="form-row__action">${action}</div>
    </div>`;
}
