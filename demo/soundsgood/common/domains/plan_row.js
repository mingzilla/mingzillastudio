// One item of the plan of a download task: the group it goes to and whether it is added.
class PlanRow {
    constructor(fields = {}) {
        this.id = null;
        this.url = null;
        this.title = null;
        this.shape = 'VIDEOS_YOUTUBE';
        this.goesTo = null; // the group name
        this.isNew = false; // the group does not exist yet
        this.agreed = false; // the user agreed to the new group
        this.action = 'ADD'; // ADD | SKIP
        this.reason = null;
        this.key = null;
        this.name = null; // the stem
        Object.assign(this, fields);
        Object.freeze(this);
    }
}

if (typeof module !== 'undefined') module.exports = PlanRow;
