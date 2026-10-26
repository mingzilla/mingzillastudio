const test = require('node:test');
const assert = require('node:assert/strict');
global.NameNormalize = require('../../common/util/name_normalize.util');
global.JobOrder = require('./job_order.util');
global.JobReadiness = require('./job_readiness.util');
global.TaskState = require('./task_state.util');
global.PlanTable = require('./plan_table.util');
const StageRules = require('./stage_rules.util');
const ItemMarks = require('./item_marks.util');
const ContentScope = require('./content_scope.util');
const TabId = require('./tab_id.util');
const JobsView = require('./jobs_view.util');

const item = (fields) => ({ id: 1, hasRaw: false, hasSummary: false, stale: false, notes: [], ...fields });
const job = (fields) => ({ id: 1, taskId: 1, itemId: 1, itemName: 'a', stage: 'TRANSCRIBE', state: 'READY', orderingIndex: 0, progress: 0, message: null, ...fields });

test('ticking summarise ticks transcribe; unticking transcribe unticks summarise', () => {
    assert.deepEqual(StageRules.ticked([], 'SUMMARISE', true), ['TRANSCRIBE', 'SUMMARISE']);
    assert.deepEqual(StageRules.ticked(['TRANSCRIBE', 'SUMMARISE'], 'TRANSCRIBE', false), []);
});

test('a stage applies to the items that still need it', () => {
    const none = item({});
    const raw = item({ hasRaw: true });
    const stale = item({ hasRaw: true, hasSummary: true, stale: true });
    const both = ['TRANSCRIBE', 'SUMMARISE'];
    assert.deepEqual(StageRules.jobsFor(none, both), ['TRANSCRIBE', 'SUMMARISE']);
    assert.deepEqual(StageRules.jobsFor(raw, both), ['SUMMARISE']);
    assert.deepEqual(StageRules.jobsFor(stale, both), ['SUMMARISE']);
    assert.equal(StageRules.canProceed([], both), false);
    assert.equal(StageRules.canProceed([raw], []), false);
    assert.equal(StageRules.canProceed([raw], both), true);
});

test('a stage that every item has is locked', () => {
    assert.deepEqual(StageRules.lockedStages([item({ hasRaw: true }), item({ hasRaw: true, hasSummary: true })]), ['TRANSCRIBE']);
});

test('the name of a task is its last stage and its groups', () => {
    assert.equal(StageRules.taskName(['TRANSCRIBE', 'SUMMARISE'], ['llm_basics']), 'summarise llm_basics');
    assert.equal(StageRules.taskName(['TRANSCRIBE'], ['a', 'b', 'a', 'c']), 'transcribe a +2');
    assert.equal(StageRules.taskName(['CONSOLIDATE'], []), 'consolidate notes');
});

test('item marks', () => {
    assert.equal(ItemMarks.stateOf(item({})), 'META');
    assert.equal(ItemMarks.stateOf(item({ hasRaw: true })), 'RAW');
    assert.equal(ItemMarks.stateOf(item({ hasRaw: true, hasSummary: true, stale: true })), 'STALE');
});

test('unfinished: a missing stage, a stale summary, a job, or a note after the mark', () => {
    const none = new Set();
    assert.equal(ContentScope.isUnfinished(item({ hasRaw: true, hasSummary: true }), 'COURSE', none), false);
    assert.equal(ContentScope.isUnfinished(item({ hasRaw: true }), 'COURSE', none), true);
    assert.equal(ContentScope.isUnfinished(item({ hasRaw: true, hasSummary: true, stale: true }), 'COURSE', none), true);
    assert.equal(ContentScope.isUnfinished(item({ id: 7, hasRaw: true, hasSummary: true }), 'COURSE', new Set([7])), true);
    assert.equal(ContentScope.isUnfinished(item({ notes: [{ consolidated: true }, { consolidated: false }] }), 'NOTES', none), true);
    assert.equal(ContentScope.isUnfinished(item({ notes: [{ consolidated: true }] }), 'NOTES', none), false);
});

test('the content filter: sections show only what matches', () => {
    const groups = [{ id: 1, shape: 'COURSE', name: 'a' }, { id: 2, shape: 'COURSE', name: 'b' }, { id: 3, shape: 'MEETINGS', name: '202609' }, { id: 4, shape: 'MEETINGS', name: '202610' }];
    const items = [item({ id: 1, groupId: 1, hasRaw: true, hasSummary: true }), item({ id: 2, groupId: 1 }), item({ id: 3, groupId: 2, hasRaw: true, hasSummary: true }), item({ id: 4, groupId: 3 }), item({ id: 5, groupId: 4 })];
    const none = new Set();
    const ids = (content, shape = 'COURSE') => ContentScope.sections(groups, items, shape, content, none).map((section) => [section.group.id, section.items.map((each) => each.id)]);
    assert.deepEqual(ids('UNFINISHED'), [[1, [2]]]);
    assert.deepEqual(ids('FINISHED'), [[1, [1]], [2, [3]]]);
    assert.deepEqual(ids('ALL'), [[1, [1, 2]], [2, [3]]]);
    assert.deepEqual(ids('ALL', 'MEETINGS'), [[4, [5]], [3, [4]]]);
});

test('tab ids', () => {
    assert.equal(TabId.kindOf('task-new-video-playlist'), 'NEW_TASK');
    assert.equal(TabId.newTaskKindOf(TabId.newTask('VIDEO_PLAYLIST')), 'VIDEO_PLAYLIST');
    assert.equal(TabId.kindOf('task-12'), 'TASK');
    assert.equal(TabId.entityIdOf('task-12'), 12);
    assert.equal(TabId.kindOf('item-7'), 'ITEM');
    assert.equal(TabId.isNew('note-new'), true);
    assert.equal(TabId.isNew('task-1'), false);
});

test('NOT_READY is worked out from the jobs and the files', () => {
    const items = [item({ id: 1 }), item({ id: 2, hasRaw: true })];
    const transcribe = job({ id: 1, itemId: 1 });
    const summarise = job({ id: 2, itemId: 1, stage: 'SUMMARISE' });
    const ready = job({ id: 3, itemId: 2, stage: 'SUMMARISE' });
    assert.deepEqual(JobReadiness.displayOf(summarise, [transcribe, summarise], items), { state: 'NOT_READY', reason: 'after transcribe' });
    assert.deepEqual(JobReadiness.displayOf(summarise, [{ ...transcribe, state: 'FAILED' }, summarise], items), { state: 'NOT_READY', reason: 'transcribe failed' });
    assert.deepEqual(JobReadiness.displayOf(summarise, [summarise], items), { state: 'NOT_READY', reason: 'no transcript job' });
    assert.equal(JobReadiness.displayOf(ready, [ready], items).state, 'READY');
    assert.equal(JobReadiness.displayOf(transcribe, [transcribe], items).state, 'READY');
});

test('a day is consolidated after the day before it', () => {
    const first = job({ id: 1, stage: 'CONSOLIDATE', itemName: '20261024' });
    const second = job({ id: 2, stage: 'CONSOLIDATE', itemName: '20261025' });
    assert.equal(JobReadiness.displayOf(first, [first, second], []).state, 'READY');
    assert.deepEqual(JobReadiness.displayOf(second, [first, second], []), { state: 'NOT_READY', reason: 'after 20261024' });
    assert.equal(JobReadiness.displayOf(second, [{ ...first, state: 'FAILED' }, second], []).reason, '20261024 failed');
    assert.deepEqual(JobReadiness.blockedBy({ ...first, state: 'FAILED' }, [first, second]).map((each) => each.id), [2]);
});

test('a failed transcript blocks the summary of its item', () => {
    const failed = job({ id: 1, itemId: 1, state: 'FAILED' });
    const summarise = job({ id: 2, itemId: 1, stage: 'SUMMARISE' });
    const other = job({ id: 3, itemId: 2, stage: 'SUMMARISE' });
    assert.deepEqual(JobReadiness.blockedBy(failed, [failed, summarise, other]).map((each) => each.id), [2]);
});

test('job controls', () => {
    assert.deepEqual(TaskState.actionsOf('FAILED'), ['retry', 'cancel']);
    assert.deepEqual(TaskState.actionsOf('RUNNING'), ['cancel']);
    assert.deepEqual(TaskState.actionsOf('DONE'), []);
});

test('the state of a task comes from its jobs and the files', () => {
    const task = { itemIds: [1], stageValues: ['TRANSCRIBE'] };
    assert.equal(TaskState.stateOf(task, [job({})], [item({})]), 'RUNNING');
    assert.equal(TaskState.stateOf(task, [], [item({})]), 'NOT_RUNNING');
    assert.equal(TaskState.stateOf(task, [], [item({ hasRaw: true })]), 'DONE');
    assert.equal(TaskState.stateOf({ itemIds: [1], stageValues: ['CONSOLIDATE'] }, [], [item({ notes: [{ consolidated: false }] })]), 'NOT_RUNNING');
});

test('pause warns about the running jobs and the jobs of other tasks that wait for them', () => {
    const own = [job({ id: 1, itemId: 1, state: 'RUNNING' }), job({ id: 2, itemId: 2 })];
    const all = [...own, job({ id: 3, taskId: 2, itemId: 1, stage: 'SUMMARISE' }), job({ id: 4, taskId: 2, itemId: 9, stage: 'SUMMARISE' })];
    assert.deepEqual(TaskState.pauseWarning(own, all), { running: 1, waiting: 1 });
    assert.equal(TaskState.pauseText({ running: 1, waiting: 1 }), '1 running job stops and loses the work. 1 job in other tasks wait for them.');
});

test('the table of a task shows the first 20 rows and the number of the rest', () => {
    const jobs = Array.from({ length: 25 }, (unused, index) => job({ id: index + 1, orderingIndex: index }));
    const displays = new Map(jobs.map((each) => [each.id, { state: 'READY', reason: null }]));
    const table = JobsView.tableRows(jobs, displays);
    assert.equal(table.rows.length, 20);
    assert.equal(table.more, 5);
});

test('a lane row: done and total of the run, with the running job counted in neither done nor left', () => {
    const jobs = [job({ id: 1, state: 'RUNNING' }), job({ id: 2 }), job({ id: 3, stage: 'SUMMARISE' })];
    const displays = new Map([[1, { state: 'RUNNING' }], [2, { state: 'READY' }], [3, { state: 'NOT_READY', reason: 'transcribe failed' }]]);
    const stats = { finished: { TRANSCRIBE: 7, SUMMARISE: 0, CONSOLIDATE: 0 }, medianSeconds: { TRANSCRIBE: 30, SUMMARISE: null, CONSOLIDATE: null } };
    const [transcript, summary, consolidate] = JobsView.lanes(jobs, displays, stats, 5);
    assert.equal(transcript.done, 7);
    assert.equal(transcript.running, 1);
    assert.equal(transcript.total, 9);
    assert.equal(transcript.etaText, 'est. ~1 min');
    assert.equal(summary.total, 1);
    assert.equal(summary.etaText, 'stuck');
    assert.equal(consolidate.total, 0);
    assert.equal(consolidate.etaText, 'idle');
});

test('one estimate for the run: the longest lane, with the estimate of each lane as its title', () => {
    const lane = (label, kind, seconds, etaText) => ({ label, kind, seconds, etaText });
    const lanes = [lane('transcribe', 'WORK', 180, 'est. ~3 min'), lane('summarise', 'WORK', 11, 'est. ~11 s'), lane('consolidate', 'IDLE', 0, 'idle')];
    assert.deepEqual(JobsView.overall(lanes), { text: 'est. ~3 min', title: 'transcribe: est. ~3 min\nsummarise: est. ~11 s\nconsolidate: idle' });
    assert.equal(JobsView.overall([lane('a', 'WORK', null, 'est. …'), lane('b', 'WORK', 5, 'est. ~5 s')]).text, 'est. …');
    assert.equal(JobsView.overall([lane('a', 'STUCK', 0, 'stuck'), lane('b', 'IDLE', 0, 'idle')]).text, 'stuck');
    assert.equal(JobsView.overall([lane('a', 'IDLE', 0, 'idle')]).text, 'idle');
});

test('the time left: a job that waits for the user is not in the estimate, and no history shows a placeholder', () => {
    assert.equal(JobsView.counts({ state: 'NOT_READY', reason: 'after transcribe' }), true);
    assert.equal(JobsView.counts({ state: 'NOT_READY', reason: 'transcribe failed' }), false);
    assert.equal(JobsView.counts({ state: 'FAILED', reason: 'download failed' }), false);
    assert.equal(JobsView.formatEta(null), 'est. …');
    assert.equal(JobsView.formatEta(20), 'est. ~20 s');
    assert.equal(JobsView.formatEta(2100), 'est. ~35 min');
    assert.equal(JobsView.formatEta(5400), 'est. ~1 h 30 min');
});

test('tasks reorder by their header', () => {
    const tasks = [{ id: 1, orderingIndex: 0 }, { id: 2, orderingIndex: 1 }, { id: 3, orderingIndex: 2 }];
    assert.deepEqual(JobOrder.moveTask(tasks, 3, 1, false).map((task) => task.id), [3, 1, 2]);
});

test('plan table: a new group must be agreed to; a rename goes to the group of that name', () => {
    const rows = [{ id: 1, action: 'ADD', shape: 'VIDEOS_YOUTUBE', goesTo: 'new_person', isNew: true, agreed: false }, { id: 2, action: 'ADD', shape: 'VIDEOS_YOUTUBE', goesTo: 'new_person', isNew: true, agreed: false }];
    assert.equal(PlanTable.canProceed('a', rows, false, true), false);
    assert.equal(PlanTable.canProceed('a', PlanTable.agreeGroup(rows, 'VIDEOS_YOUTUBE', 'new_person', true), false, true), true);
    assert.equal(PlanTable.canProceed('a', [], true, false), true);
    assert.equal(PlanTable.canProceed('', [], true, false), false);
    assert.deepEqual(PlanTable.groupsOf(rows).map((group) => [group.name, group.count]), [['new_person', 2]]);
    const renamed = PlanTable.renameGroup(rows, 'VIDEOS_YOUTUBE', 'new_person', 'Cole Medin', [{ shape: 'VIDEOS_YOUTUBE', name: 'cole_medin' }]);
    assert.equal(renamed[0].isNew, false);
});

test('names on disk', () => {
    assert.equal(NameNormalize.of('Agents Intro: Part 1!'), 'agents_intro_part_1');
    assert.equal(NameNormalize.stem('s01_l02', 'Set up'), 's01_l02__set_up');
});
