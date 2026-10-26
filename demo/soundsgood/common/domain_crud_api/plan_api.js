// Test and apply of the download tasks (playlist, item). Test writes nothing; apply makes the groups and the entries of meta.json.
class PlanApi {
    static shapeOf(url) {
        if (url.includes('udemy.com')) return 'COURSE';
        return url.includes('bilibili') ? 'VIDEOS_BILIBILI' : 'VIDEOS_YOUTUBE';
    }

    static creatorOf(url) {
        const known = [['cole', 'cole_medin'], ['nate', 'nate_herk']].find(([hint]) => url.includes(hint));
        return known ? known[1] : 'new_creator';
    }

    static courseOf(url) {
        return NameNormalize.of(url.split('/course/')[1]?.split('/')[0] || 'new_course');
    }

    static lastSegment(url) {
        return url.split(/[?&#]/)[0].split(/[/=]/).filter(Boolean).pop() || 'item';
    }

    static isList(url) {
        return url.includes('list=') || url.includes('/playlist') || (url.includes('udemy.com') && !url.includes('/lecture/'));
    }

    static row(url, shape, goesTo, title, key, name) {
        const exists = PrototypeWorld.groups.find((group) => group.shape === shape && group.name === goesTo);
        const stored = PrototypeWorld.items.some((item) => item.key === key || (exists && item.groupId === exists.id && item.title === title));
        return new PlanRow({ id: PrototypeWorld.nextId('plan'), url, title, shape, goesTo, isNew: !exists, action: stored ? 'SKIP' : 'ADD', reason: stored ? 'already stored' : null, key, name });
    }

    // mode: PLAYLIST (one URL: the whole list) | ITEM (the URLs: only those items)
    static async test({ mode, urls }) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        const rows = [];
        const warnings = [];
        if (mode === 'PLAYLIST') {
            const url = urls[0];
            if (urls.length > 1) warnings.push('Only the first URL is used: a playlist task takes one URL.');
            if (!PlanApi.isList(url)) warnings.push('This URL is one item: use download item.');
            const shape = PlanApi.shapeOf(url);
            if (shape === 'COURSE') {
                const course = PlanApi.courseOf(url);
                ['Welcome', 'Basics', 'Practice', 'Wrap up'].forEach((title, index) => rows.push(PlanApi.row(url, shape, course, title, `udemy:${course}:${index + 1}`, NameNormalize.stem(`s01_l0${index + 1}`, title))));
            } else {
                const creator = PlanApi.creatorOf(url);
                [1, 2, 3, 4, 5].forEach((n) => rows.push(PlanApi.row(url, shape, creator, `${creator.replace(/_/g, ' ')} episode ${n}`, `${shape}:${creator}-${n}`, NameNormalize.stem(`2026100${n}`, `${creator} episode ${n}`))));
            }
        } else {
            urls.forEach((url) => {
                const shape = PlanApi.shapeOf(url);
                if (PlanApi.isList(url)) {
                    warnings.push(`${url}: this is a list. Use download playlist.`);
                    return;
                }
                const title = PlanApi.lastSegment(url).replace(/[-_]/g, ' ');
                const group = shape === 'COURSE' ? PlanApi.courseOf(url) : PlanApi.creatorOf(url);
                rows.push(PlanApi.row(url, shape, group, title, `${shape}:${PlanApi.lastSegment(url)}`, NameNormalize.stem(shape === 'COURSE' ? 's00_l00' : '20261026', title)));
            });
        }
        return { rows, warnings };
    }

    // The next lesson name of a course: after the last lesson of its list.
    static nextLessonName(group, title) {
        const own = PrototypeWorld.items.filter((item) => item.groupId === group.id).map((item) => /^s(\d+)_l(\d+)__/.exec(item.name)).filter(Boolean).map((match) => [Number(match[1]), Number(match[2])]);
        const [section, lesson] = own.sort((a, b) => a[0] - b[0] || a[1] - b[1]).pop() || [1, 0];
        const pad = (n) => String(n).padStart(2, '0');
        return NameNormalize.stem(`s${pad(section)}_l${pad(lesson + 1)}`, title);
    }

    // Creates the groups that are new and the entries that are not stored yet.
    static async apply({ rows }) {
        const itemIds = [];
        const groups = [];
        rows.filter((row) => row.action === 'ADD').forEach((row) => {
            const group = PrototypeWorld.groupFor(row.shape, NameNormalize.of(row.goesTo), row.goesTo);
            if (!groups.some((each) => each.id === group.id)) groups.push({ id: group.id, name: group.name, shape: group.shape });
            if (PrototypeWorld.items.some((item) => item.key === row.key)) return;
            const name = row.shape === 'COURSE' && /^s0\d_l0\d__/.test(row.name) && PrototypeWorld.items.some((item) => item.groupId === group.id) ? PlanApi.nextLessonName(group, row.title) : row.name.replace(/^s00_l00/, 's01_l01');
            const item = new Item({ id: PrototypeWorld.nextId('item'), groupId: group.id, name, key: row.key, title: row.title, source: row.url });
            PrototypeWorld.items = [...PrototypeWorld.items, item];
            itemIds.push(item.id);
        });
        PrototypeWorld.emit();
        return { itemIds, groups };
    }
}
