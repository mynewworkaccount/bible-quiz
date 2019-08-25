class Game {
    constructor() {
        this._q = {};
        this._over = false;
        this._counter = 0;
        this._index = 0;
        this._seed = 0;
        this._wins = 0;
        this._qs = [];
    }

    set seed(value) {
        this._seed = value;
    }

    set index(value) {
        this._index = value;
    }

    set counter(value) {
        this._counter = value;
    }

    set over(value) {
        this._over = value;
    }

    set qs(value) {
        this._qs = value;
    }

    set wins(value) {
        this._wins = value;
    }

    get seed() {
        return this._seed;
    }

    get index() {
        return +this._index;
    }

    get counter() {
        return this._counter;
    }

    get over() {
        return this._over;
    }

    get wins() {
        return this._wins;
    }

    get q() {
        return this._qs[this._counter];
    }

    get total() {
        return this._qs.length;
    }

    get score() {
        return this._qs.filter(i => i.correct).length;
    }

    addWin() {
        const win = this.score >= this.total - 1;
        if(win) {
            this._wins ++;
        }

        return win;
    }

    answer(qid, selected) {
        const q = this._qs.find(i => i.id == qid);
        const answer = q.answers.find(i => i.correct);
        const correct = answer.id == selected;
        q.correct = correct;
        return correct;
    }

    next() {
        this._counter++;
        const qs = this._qs.length;
        this._over = this._counter >= qs;
    }

    reset() {
        this._q = {};
        this._qs = [];
        this._counter = 0;
        this._over = false;
        this._index++;
    }

    toJSON() {
        return {
            counter: this._counter,
            index: this._index,
            seed: this._seed,
            over: this._over,
            wins: this._wins
        };
    }
}