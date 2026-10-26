// Dates in names: yyyymmdd[_hhmmss].
class DateText {
    static two(n) {
        return String(n).padStart(2, '0');
    }

    static now() {
        const at = new Date();
        return { date: `${at.getFullYear()}${DateText.two(at.getMonth() + 1)}${DateText.two(at.getDate())}`, time: `${DateText.two(at.getHours())}${DateText.two(at.getMinutes())}${DateText.two(at.getSeconds())}` };
    }
}

if (typeof module !== 'undefined') module.exports = DateText;
