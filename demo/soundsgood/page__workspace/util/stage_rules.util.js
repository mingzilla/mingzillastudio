// The two checkboxes: transcribe, summarise. Ticking summarise ticks transcribe; unticking transcribe unticks summarise.
class StageRules {
    static ORDER = ['TRANSCRIBE', 'SUMMARISE'];

    static ticked(values, stage, on) {
        const at = StageRules.ORDER.indexOf(stage);
        const next = on ? [...new Set([...values, ...StageRules.ORDER.slice(0, at + 1)])] : values.filter((each) => StageRules.ORDER.indexOf(each) < at);
        return StageRules.ORDER.filter((each) => next.includes(each));
    }

    // A stage applies to the items that still need it.
    static jobsFor(item, values) {
        const stages = [];
        if (values.includes('TRANSCRIBE') && !item.hasRaw) stages.push('TRANSCRIBE');
        if (values.includes('SUMMARISE') && (!item.hasSummary || item.stale)) stages.push('SUMMARISE');
        return stages;
    }

    static jobCount(items, values) {
        return items.reduce((sum, item) => sum + StageRules.jobsFor(item, values).length, 0);
    }

    static canProceed(items, values) {
        return items.length > 0 && values.length > 0;
    }

    // A stage that every item has finished is ticked and locked.
    static lockedStages(items) {
        return StageRules.ORDER.filter((stage) => items.length > 0 && items.every((item) => StageRules.jobsFor(item, [stage]).length === 0));
    }

    static labelOf(stage) {
        return { TRANSCRIBE: 'transcribe', SUMMARISE: 'summarise', CONSOLIDATE: 'consolidate' }[stage];
    }

    // The name of a task: its last stage and its groups, `llm_basics` or `llm_basics +2`.
    static taskName(stageValues, groupNames) {
        const last = StageRules.ORDER.filter((stage) => stageValues.includes(stage)).pop() || 'CONSOLIDATE';
        const names = [...new Set(groupNames)];
        const where = last === 'CONSOLIDATE' ? 'notes' : names.length > 1 ? `${names[0]} +${names.length - 1}` : names[0] || '';
        return `${StageRules.labelOf(last)} ${where}`.trim();
    }
}

if (typeof module !== 'undefined') module.exports = StageRules;
