// The stage of a job as one letter, [T] [S] [C]; the title has the word.
class StageTag {
    static LETTERS = { TRANSCRIBE: 'T', SUMMARISE: 'S', CONSOLIDATE: 'C' };
}

function StageTagComp({ stage }) {
    return html`<span className="stage-tag" title=${StageRules.labelOf(stage)}>[${StageTag.LETTERS[stage]}]</span>`;
}
