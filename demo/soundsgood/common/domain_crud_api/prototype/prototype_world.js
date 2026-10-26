// The fake backend of the prototype: one mutable world of domain objects, and a timer that moves jobs through their states.
// Only the *_api.js files in the parent folder use it. Delete this folder when the real server exists.
// Domain objects are replaced, never edited, so a reader that holds an array sees the same items until one really changes.

class PrototypeWorld {
    static TICK_MS = 1500;
    static listeners = [];
    static timer = null;
    static ids = { group: 100, item: 1000, task: 10, job: 100, typo: 10, topic: 20, plan: 1, notice: 1 };
    static groups = [];
    static items = [];
    static tasks = [];
    static jobs = [];
    static typos = [];
    static topics = [];
    static inbox = [];
    static preference = null;
    static summaryLaneCapacity = 5;
    static notesMark = '';
    static runStartedAt = null; // set when a job enters an empty job list

    static nextId(kind) {
        return ++PrototypeWorld.ids[kind];
    }

    static watch(fn) {
        PrototypeWorld.listeners.push(fn);
        return () => {
            PrototypeWorld.listeners = PrototypeWorld.listeners.filter((each) => each !== fn);
        };
    }

    static emit() {
        PrototypeWorld.refreshNotes();
        PrototypeWorld.listeners.forEach((fn) => fn());
    }

    static replaced(list, id, Cls, changes) {
        return list.map((each) => (each.id === id ? new Cls({ ...each, ...changes }) : each));
    }

    static updateItem(id, changes) {
        PrototypeWorld.items = PrototypeWorld.replaced(PrototypeWorld.items, id, Item, changes);
    }

    static updateJob(id, changes) {
        PrototypeWorld.jobs = PrototypeWorld.replaced(PrototypeWorld.jobs, id, Job, changes);
    }

    static activeJobs() {
        return PrototypeWorld.jobs.filter((job) => !job.archived);
    }

    // The finished jobs of the current run, and the median time of a job in each stage (from the archive).
    static stats() {
        const archived = PrototypeWorld.jobs.filter((job) => job.archived && job.finishedAt);
        const running = PrototypeWorld.activeJobs().length > 0 && PrototypeWorld.runStartedAt !== null;
        const finished = {};
        const medianSeconds = {};
        ['TRANSCRIBE', 'SUMMARISE', 'CONSOLIDATE'].forEach((stage) => {
            const own = archived.filter((job) => job.stage === stage);
            finished[stage] = running ? own.filter((job) => job.finishedAt >= PrototypeWorld.runStartedAt).length : 0;
            const seconds = own.filter((job) => job.startedAt).map((job) => (job.finishedAt - job.startedAt) / 1000).sort((a, b) => a - b);
            medianSeconds[stage] = seconds.length > 0 ? seconds[Math.floor(seconds.length / 2)] : null;
        });
        return new JobStats({ finished, medianSeconds });
    }

    // --- notes: a day file is H2 blocks; a note is consolidated when its id is up to the consolidated mark
    static notesOf(item) {
        if (!item.rawText) return [];
        const parts = item.rawText.split(/^## (\d{6})\n/m);
        const notes = [];
        for (let at = 1; at < parts.length; at += 2) {
            const id = `${item.name}_${parts[at]}`;
            notes.push(new Note({ id, time: parts[at], text: parts[at + 1].replace(/\s+$/, ''), consolidated: id <= PrototypeWorld.notesMark }));
        }
        return notes;
    }

    static rawOf(notes) {
        return notes.map((note) => `## ${note.time}\n${note.text}`).join('\n\n');
    }

    static refreshNotes() {
        const noteGroups = new Set(PrototypeWorld.groups.filter((group) => group.shape === 'NOTES').map((group) => group.id));
        PrototypeWorld.items = PrototypeWorld.items.map((item) => {
            if (!noteGroups.has(item.groupId)) return item;
            const notes = PrototypeWorld.notesOf(item);
            return JSON.stringify(notes) === JSON.stringify(item.notes) ? item : new Item({ ...item, notes });
        });
    }

    static groupFor(shape, name, displayName) {
        let group = PrototypeWorld.groups.find((each) => each.shape === shape && each.name === name);
        if (!group) {
            group = new Group({ id: PrototypeWorld.nextId('group'), shape, name, displayName: displayName || name });
            PrototypeWorld.groups = [...PrototypeWorld.groups, group];
        }
        return group;
    }

    // --- the stages an item still needs
    static missingStages(item, stageValues) {
        const stages = [];
        if (stageValues.includes('TRANSCRIBE') && !item.hasRaw) stages.push('TRANSCRIBE');
        if (stageValues.includes('SUMMARISE') && (!item.hasSummary || item.stale)) stages.push('SUMMARISE');
        if (stageValues.includes('CONSOLIDATE') && item.notes.some((note) => !note.consolidated)) stages.push('CONSOLIDATE');
        return stages;
    }

    // A job for an item and stage that is in the list already (not done) is refused.
    static queued(itemId, stage) {
        return PrototypeWorld.activeJobs().some((job) => job.itemId === itemId && job.stage === stage);
    }

    // --- the timer: the transcript lane runs one job, the summary lane runs up to the capacity, the consolidate lane runs one
    static start() {
        if (PrototypeWorld.timer !== null) return;
        PrototypeWorld.timer = setInterval(PrototypeWorld.tick, PrototypeWorld.TICK_MS);
    }

    static laneOf(job) {
        return { TRANSCRIBE: 'TRANSCRIPT', SUMMARISE: 'SUMMARY', CONSOLIDATE: 'CONSOLIDATE' }[job.stage];
    }

    static capacityOf(lane) {
        return lane === 'SUMMARY' ? PrototypeWorld.summaryLaneCapacity : 1;
    }

    static queueOrdered() {
        const tasks = [...PrototypeWorld.tasks].sort((a, b) => a.orderingIndex - b.orderingIndex);
        return tasks.flatMap((task) => PrototypeWorld.activeJobs().filter((job) => job.taskId === task.id).sort((a, b) => a.orderingIndex - b.orderingIndex));
    }

    static tick() {
        let changed = false;
        PrototypeWorld.activeJobs().filter((job) => job.state === 'RUNNING').forEach((job) => {
            changed = true;
            const progress = Math.min(100, job.progress + 34);
            if (progress < 100) PrototypeWorld.updateJob(job.id, { progress });
            else PrototypeWorld.finish(job);
        });
        ['TRANSCRIPT', 'SUMMARY', 'CONSOLIDATE'].forEach((lane) => {
            PrototypeWorld.queueOrdered().forEach((job) => {
                const running = PrototypeWorld.activeJobs().filter((each) => each.state === 'RUNNING' && PrototypeWorld.laneOf(each) === lane).length;
                if (job.state !== 'READY' || PrototypeWorld.laneOf(job) !== lane || running >= PrototypeWorld.capacityOf(lane)) return;
                if (!PrototypeWorld.canStart(job)) return;
                PrototypeWorld.updateJob(job.id, { state: 'RUNNING', progress: 0, startedAt: Date.now() });
                changed = true;
            });
        });
        if (changed) PrototypeWorld.emit();
    }

    // A summary job starts as soon as its raw file exists. A day is consolidated after the days before it.
    static canStart(job) {
        if (job.stage === 'SUMMARISE') return PrototypeWorld.items.some((item) => item.id === job.itemId && item.hasRaw);
        if (job.stage === 'CONSOLIDATE') return !PrototypeWorld.activeJobs().some((other) => other.stage === 'CONSOLIDATE' && other.itemName < job.itemName);
        return true;
    }

    static finish(job) {
        PrototypeWorld.updateJob(job.id, { state: 'DONE', progress: 100, archived: true, finishedAt: Date.now() });
        if (job.stage === 'TRANSCRIBE') PrototypeWorld.updateItem(job.itemId, { hasRaw: true, rawText: PrototypeWorld.dummyRaw(job.itemName) });
        if (job.stage === 'SUMMARISE') PrototypeWorld.updateItem(job.itemId, { hasSummary: true, stale: false, summaryText: PrototypeWorld.dummySummary(job.itemName), summaryLine: `Summary of ${job.itemName}` });
        if (job.stage === 'CONSOLIDATE') {
            const item = PrototypeWorld.items.find((each) => each.id === job.itemId);
            const last = item.notes[item.notes.length - 1];
            if (last && last.id > PrototypeWorld.notesMark) PrototypeWorld.notesMark = last.id;
            if (!PrototypeWorld.topics.some((topic) => topic.name === `from_${item.name}`)) {
                PrototypeWorld.topics = [...PrototypeWorld.topics, new Topic({ id: PrototypeWorld.nextId('topic'), folder: 'DRAFT', number: 13 + PrototypeWorld.topics.length, name: `from_${item.name}`, tldr: `Decisions from the notes of ${item.name}`, body: PrototypeWorld.dummyTopic(item.name) })];
            }
        }
    }

    static hashOf(text) {
        let hash = 7;
        for (let at = 0; at < text.length; at++) hash = (hash * 31 + text.charCodeAt(at)) >>> 0;
        return hash.toString(16);
    }

    static dummyRaw(name) {
        return `[00:00:01] This is the transcript of ${name}.\n[00:00:09] Today we look at the main idea and a worked example.\n[00:01:30] The second part covers the trade-offs.\n[00:03:12] To sum up, keep it simple and test early.`;
    }

    static dummySummary(name) {
        return `---\nprompt: _prompts/summary__course.md\nraw_hash: 9f3a1c\n---\n# ${name}\n\n## TL;DR\n- The main idea, a worked example and the trade-offs.\n\n## Key points\n| point | detail |\n|---|---|\n| idea | keep it simple |\n| test | test early |`;
    }

    static dummyTopic(name) {
        return `# ${name}\n\n## TL;DR\n- A topic drafted from the notes of ${name}.\n\n## Decisions\n| decision | detail |\n|---|---|\n| one | keep the first version small |\n\n## Open questions\nNone.\n\n## Original text of the notes\n> ${name} keep the first version small`;
    }

    // --- seed data
    static seed() {
        const g = (id, shape, name, displayName) => new Group({ id, shape, name, displayName });
        PrototypeWorld.groups = [
            g(1, 'COURSE', 'llm_basics', 'LLM Basics'), g(2, 'COURSE', 'upskill', 'Upskill'),
            g(3, 'VIDEOS_YOUTUBE', 'cole_medin', 'Cole Medin'), g(4, 'VIDEOS_YOUTUBE', 'nate_herk', 'Nate Herk'),
            g(5, 'VIDEOS_BILIBILI', 'quant_basics_cn', 'Quant Basics'),
            g(6, 'MEETINGS', '202610', 'October 2026'), g(7, 'MEETINGS', '202609', 'September 2026'),
            g(8, 'NOTES', '202610', 'October 2026'),
        ];
        PrototypeWorld.notesMark = '20261024_083000';
        const it = (id, groupId, name, title, state, extra = {}) => new Item({ id, groupId, name, key: `k:${name}`, title, hasRaw: state !== 'META', hasSummary: state === 'SUMMARY', rawText: state !== 'META' ? PrototypeWorld.dummyRaw(name) : null, summaryText: state === 'SUMMARY' ? PrototypeWorld.dummySummary(name) : null, ...extra });
        PrototypeWorld.items = [
            it(11, 1, 's01_l01__welcome', 'Welcome', 'SUMMARY'), it(12, 1, 's01_l02__setup', 'Setup', 'RAW'), it(13, 1, 's01_l03__tokens', 'Tokens', 'META'),
            it(14, 1, 's01_l04__prompting', 'Prompting', 'META'), it(15, 1, 's02_l01__agents', 'Agents', 'META'), it(16, 1, 's02_l02__quiz', 'Quiz', 'META', { type: 'quiz' }),
            it(21, 2, 's01_l01__intro', 'Intro', 'RAW'), it(22, 2, 's01_l02__skills', 'Skills', 'RAW'), it(23, 2, 's01_l03__library', 'Library', 'META'),
            it(31, 3, '20260910__agents_intro', 'Agents intro', 'SUMMARY'), it(32, 3, '20260912__mcp_basics', 'MCP basics', 'RAW'), it(33, 3, '20260915__rag_stack', 'RAG stack', 'META'),
            it(41, 4, '20260908__n8n_flows', 'n8n flows', 'RAW'), it(42, 4, '20260918__ai_pricing', 'AI pricing', 'META'),
            it(51, 5, '20260905__factor_models', 'Factor models', 'SUMMARY'),
            it(61, 6, '20261003_101500__sprint_review', 'Sprint review', 'SUMMARY', { summaryLine: 'Sprint review: two stories carried over, release on Friday.' }),
            it(62, 6, '20261010_140000__interview_prep', 'Interview prep', 'RAW'), it(63, 6, '20261014_093000__design_sync', 'Design sync', 'META'),
            it(71, 7, '20260922_160000__planning', 'Planning', 'SUMMARY', { summaryLine: 'Planning: scope agreed for Q4.' }),
            it(81, 8, '20261021', 'Notes of 21 Oct', 'RAW', { rawText: '## 091500\nThe prototype should show every tab.\n\n## 143000\nKeep the first version small.' }),
            it(82, 8, '20261024', 'Notes of 24 Oct', 'RAW', { rawText: '## 083000\nTerms: use live, not prod.\n\n## 190500\nThe jobs column opens when a task is made.' }),
            it(83, 8, '20261025', 'Notes of 25 Oct', 'RAW', { rawText: '## 101200\nA task is the intent, a job is one item in one stage.' }),
        ];
        const job = (id, taskId, itemId, itemName, stage, state, orderingIndex, extra = {}) => new Job({ id, taskId, itemId, itemName, stage, state, orderingIndex, ...extra });
        PrototypeWorld.tasks = [
            new Task({ id: 1, name: 'summarise upskill', shape: 'COURSE', stageValues: ['TRANSCRIBE', 'SUMMARISE'], itemIds: [21, 22], orderingIndex: 0 }),
            new Task({ id: 2, name: 'transcribe llm_basics', shape: 'COURSE', stageValues: ['TRANSCRIBE'], itemIds: [13, 14, 15], orderingIndex: 1 }),
            new Task({ id: 3, name: 'summarise cole_medin', shape: 'VIDEOS_YOUTUBE', stageValues: ['TRANSCRIBE', 'SUMMARISE'], itemIds: [33], orderingIndex: 2 }),
            new Task({ id: 4, name: 'summarise nate_herk', shape: 'VIDEOS_YOUTUBE', stageValues: ['TRANSCRIBE', 'SUMMARISE'], itemIds: [42], orderingIndex: 3 }),
            new Task({ id: 5, name: 'transcribe upskill', shape: 'COURSE', stageValues: ['TRANSCRIBE'], itemIds: [23], orderingIndex: 4 }),
        ];
        PrototypeWorld.jobs = [
            job(1, 1, 21, 's01_l01__intro', 'SUMMARISE', 'READY', 0), job(2, 1, 22, 's01_l02__skills', 'SUMMARISE', 'READY', 1),
            job(3, 2, 13, 's01_l03__tokens', 'TRANSCRIBE', 'READY', 0), job(4, 2, 14, 's01_l04__prompting', 'TRANSCRIBE', 'READY', 1), job(5, 2, 15, 's02_l01__agents', 'TRANSCRIBE', 'READY', 2),
            job(6, 3, 33, '20260915__rag_stack', 'TRANSCRIBE', 'NEEDS_YOU', 0, { message: 'not logged in to the site' }), job(7, 3, 33, '20260915__rag_stack', 'SUMMARISE', 'READY', 1),
            job(8, 4, 42, '20260918__ai_pricing', 'TRANSCRIBE', 'FAILED', 0, { message: 'download failed: 403' }), job(9, 4, 42, '20260918__ai_pricing', 'SUMMARISE', 'READY', 1),
        ];
        const now = Date.now();
        PrototypeWorld.runStartedAt = now - 3600000;
        const history = (stage, seconds, count) => Array.from({ length: count }, (unused, index) => new Job({ id: PrototypeWorld.nextId('job'), taskId: 1, itemId: 11, itemName: 'history', stage, state: 'DONE', archived: true, startedAt: now - 3000000 + index * 60000, finishedAt: now - 3000000 + index * 60000 + seconds[index % seconds.length] * 1000 }));
        PrototypeWorld.jobs = [...PrototypeWorld.jobs, ...history('TRANSCRIBE', [48, 62, 55], 7), ...history('SUMMARISE', [21, 30, 26], 12), ...history('CONSOLIDATE', [14, 18], 2)];
        PrototypeWorld.typos = [
            new VoiceTypo({ id: 1, wrong: 'cloud code', suggested: 'Claude Code', context: '...I use cloud code every day' }),
            new VoiceTypo({ id: 2, wrong: 'reflexion', suggested: 'Reflection', context: '...the reflexion app has tabs' }),
            new VoiceTypo({ id: 3, wrong: 'sound good', suggested: 'Soundsgood', context: '...the sound good project' }),
            new VoiceTypo({ id: 4, wrong: 'wisper', suggested: 'Whisper', context: '...run wisper on the gpu' }),
            new VoiceTypo({ id: 5, wrong: 'tory', suggested: 'Tauri', context: '...a tory app', state: 'APPROVED' }),
            new VoiceTypo({ id: 6, wrong: 'bee lee', suggested: 'Bili', context: '...bee lee videos', state: 'APPROVED' }),
            new VoiceTypo({ id: 7, wrong: 'live', suggested: 'prod', context: '...ship to live', state: 'REJECTED' }),
        ];
        PrototypeWorld.topics = [
            new Topic({ id: 1, folder: 'MAIN', number: 7, name: 'voice_to_journal', tldr: 'Voice recordings become a journal.', body: PrototypeWorld.dummyTopic('voice_to_journal') }),
            new Topic({ id: 2, folder: 'DRAFT', number: 12, name: 'private_skills', tldr: 'Private skills library notes.', body: PrototypeWorld.dummyTopic('private_skills') }),
            new Topic({ id: 3, folder: 'SUPERSEDED', number: 3, name: 'old_topic', tldr: 'Dropped topic.', body: PrototypeWorld.dummyTopic('old_topic') }),
        ];
        PrototypeWorld.inbox = [
            new InboxFile({ id: 1, name: 'team_call.m4a', date: '20261022_101500', sizeMb: 38 }),
            new InboxFile({ id: 2, name: 'review.mp4', date: '20261023_150000', sizeMb: 212 }),
            new InboxFile({ id: 3, name: 'standup.m4a', date: '20260930_090000', sizeMb: 12 }),
        ];
        PrototypeWorld.preference = new UserPreferenceStoreData();
        PrototypeWorld.refreshNotes();
    }
}
