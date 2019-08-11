class Game {
    constructor() {
        this._seed = 0;
        this._index = 0;
        this._score = '';
        this._scoreText = '';
        this._gameover = false;
        this._resetgame = false;
    }

    get index() {
        return +this._index;
    }

    get seed() {
        return this._seed;
    }

    get score() {
        return this._score;
    }

    get scoreText() {
        return this._scoreText;
    }

    get over() {
        return this._gameover === "true";
    }

    get reset() {
        return this._resetgame === "true";
    }

    get offline() {
        return navigator.onLine === false;
    }

    set index(value) {
        this._index = value;
    }

    set seed(value) {
        this._seed = value;
    }

    set reset(value) {
        this._resetgame = value;
    }

    set over(value) {
        this._gameover = value;
    }

    set score(value) {
        this._score = value;
    }

    set scoreText(value) {
        this._scoreText = value;
    }
}