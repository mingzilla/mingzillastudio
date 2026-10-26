// Runs `fn` once, `ms` after the last call. SEARCH is the pause for a live search box or a keyup handler.

class Debounce {
    static SEARCH = 150;

    static of(fn, ms) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                fn(...args);
            }, ms);
        };
    }
}

if (typeof module !== 'undefined') module.exports = Debounce;
