// What the user keeps between sessions. In the real app it is saved in the database; here it lives in the page.
class UserPreferenceStoreData {
    constructor(fields = {}) {
        this.openTabIds = [];
        this.listWidth = 340;
        this.jobsWidth = 520;
        this.listOpen = true;
        this.jobsOpen = false;
        this.summaryLaneCapacity = 5;
        this.promptFile = '_prompts/summary__course.md';
        this.loaded = false;
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = UserPreferenceStoreData;
