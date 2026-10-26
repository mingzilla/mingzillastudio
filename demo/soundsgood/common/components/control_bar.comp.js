class ControlBarUtil {
    static classOf(button) {
        return ['control-bar__button', button.primary ? 'control-bar__button--primary' : '', button.icon ? 'control-bar__button--icon' : '', button.active ? 'control-bar__button--active' : ''].filter(Boolean).join(' ');
    }
}

function ControlBarComp({ buttons, endButtons = [], onPress, children }) {
    const draw = (button) => html`<button key=${button.id} className=${ControlBarUtil.classOf(button)} disabled=${button.disabled} title=${button.title} aria-label=${button.title} onClick=${() => onPress(button.id)}>${button.icon ?? button.label}</button>`;
    return html`<div className="control-bar">
        ${buttons.map(draw)}
        <span className="control-bar__fields">${children}</span>
        ${endButtons.map(draw)}
    </div>`;
}
