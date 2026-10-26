class Guard {
    constructor(fields) {
        Object.assign(this, fields);
    }
}

if (typeof module !== 'undefined') module.exports = Guard;
