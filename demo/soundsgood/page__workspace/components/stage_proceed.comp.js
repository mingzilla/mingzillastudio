// The checkboxes of the stages and Proceed. Presentational: the parent owns the data and the callbacks.
function StageProceedComp({ stageValues, lockedStages = [], canProceed, onTick, onProceed, stages = StageRules.ORDER, label = 'Proceed' }) {
    return html`<div className="stage-proceed">
        ${stages.map((stage) => html`<${CheckBoxComp} key=${stage} label=${StageRules.labelOf(stage)} checked=${stageValues.includes(stage) || lockedStages.includes(stage)} disabled=${lockedStages.includes(stage)} onChange=${(on) => onTick(stage, on)} />`)}
        <button className="button button--primary" disabled=${!canProceed} onClick=${onProceed}>${label}</button>
    </div>`;
}
