class Game {
    constructor() {
        this._q = {};
        this._over = false;
        this._counter = 0;
        this._index = 0;
        this._seed = 0;
        this._wins = 0;
        this._qs = [];
        this.CACHE = "state-cache";

        this.loadState();
    }

    update(state) {
        this._seed = state.seed;
        this._index = state.index;
        this._qs = state.questions;
        this.save();
    }

    save() {
        localStorage.setItem(this.CACHE, JSON.stringify({
            _seed: this._seed,
            _index: this._index,
            _over: this._over,
            _wins: this._wins
        }));
    }

    loadState() {
        const json = localStorage.getItem(this.CACHE);
        if (json) {
            const state = JSON.parse(json);
            Object.assign(this, state);
        }
    }

    answer(qid, selected) {
        const q = this._qs.find(i => i.id == qid);
        const answer = q.answers.find(i => i.correct);
        const correct = answer.id == selected;
        q.selectedAnswer = selected;
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

    wins() {
        this._wins = this._wins + 1;
    }

    get index() {
        return +this._index;
    }

    get seed() {
        return this._seed;
    }

    get over() {
        return this._over;
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
}