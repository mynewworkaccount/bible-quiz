describe('Game engine', () => {

    let game;

    beforeEach(() => {
        game = newGame();
    });

    it('initialises correctly', () => {
        expect(game.total).toEqual(5);
        expect(game.q.id).toEqual(1);
        expect(game.score).toEqual(0);
        expect(game.over).toEqual(false);
        expect(game.wins).toEqual(0);
        expect(game.counter).toEqual(0);
        expect(game.seed).toEqual(100);
        expect(game.index).toEqual(0);
    });

    it('marks answer correctly', () => {
        expect(game.answer(1, 1)).toEqual(true);
        expect(game.answer(1, 2)).toEqual(false);
        expect(game.answer(1, 3)).toEqual(false);
    });

    it('serializes into correct JSON', () => {
        expect(JSON.stringify(game)).toEqual(
            '{"counter":0,"index":0,"seed":100,"over":false,"wins":0}');
    });

    it('moves correctly to the next question', () => {
        game.next();
        expect(game.q.id).toEqual(2);
    });

    it('all correct answers is a win', () => {
        game.answer(1, 1);
        game.next();

        game.answer(2, 1);
        game.next();

        game.answer(3, 1);
        game.next();

        game.answer(4, 1);
        game.next();

        game.answer(5, 1);
        game.next();

        const win = game.addWin();

        expect(win).toEqual(true);
        expect(game.over).toEqual(true);
        expect(game.score).toEqual(5);
        expect(game.wins).toEqual(1);
    });

    it('2 wrong answers lose', () => {
        game.answer(1, 1);
        game.next();

        game.answer(2, 1);
        game.next();

        game.answer(3, 1);
        game.next();

        game.answer(4, 0);
        game.next();

        game.answer(5, 0);
        game.next();

        const win = game.addWin();

        expect(win).toEqual(false);
        expect(game.over).toEqual(true);
        expect(game.score).toEqual(3);
        expect(game.wins).toEqual(0);
    });

    it('resets correctly without changing the number of wins', () => {
        game.answer(1, 1);
        game.next();

        game.answer(2, 1);
        game.next();

        game.answer(3, 1);
        game.next();

        game.answer(4, 1);
        game.next();

        game.answer(5, 1);
        game.next();

        const win = game.addWin();

        game.reset();

        expect(win).toEqual(true);
        expect(game.wins).toEqual(1);
        expect(game.index).toEqual(1);
        expect(game.total).toEqual(0);
        expect(game.score).toEqual(0);
        expect(game.over).toEqual(false);
        expect(game.counter).toEqual(0);
    });

    it('game counters work correctly', () => {
        game.answer(1, 1);
        game.next();
        expect(game.over).toEqual(false);
        expect(game.counter).toEqual(1);

        game.answer(2, 1);
        game.next();
        expect(game.over).toEqual(false);
        expect(game.counter).toEqual(2);

        game.answer(3, 1);
        game.next();
        expect(game.over).toEqual(false);
        expect(game.counter).toEqual(3);

        game.answer(4, 1);
        game.next();
        expect(game.over).toEqual(false);
        expect(game.counter).toEqual(4);

        game.answer(5, 1);
        game.next();
        expect(game.over).toEqual(true);
        expect(game.counter).toEqual(5);
    });
});

function newGame() {
    const data = {
        "seed": 100,
        "index": 0,
        "questions": [
            {
                "id": 1,
                "book": 13,
                "text": "Previously known as Jebus",
                "answers": [
                    {
                        "id": 3,
                        "text": "Jericho"
                    },
                    {
                        "id": 1,
                        "text": "Jerusalem",
                        "correct": true
                    },
                    {
                        "id": 2,
                        "text": "Hebron"
                    }
                ]
            },
            {
                "id": 2,
                "book": 27,
                "text": "Number of satraps appointed by Darius the Mede",
                "answers": [
                    {
                        "id": 2,
                        "text": 130
                    },
                    {
                        "id": 1,
                        "text": 120,
                        "correct": true
                    },
                    {
                        "id": 3,
                        "text": 140
                    }
                ]
            },
            {
                "id": 3,
                "book": 12,
                "text": "The god of the city of Ekron",
                "answers": [
                    {
                        "id": 1,
                        "text": "Baal-zebub",
                        "correct": true
                    },
                    {
                        "id": 3,
                        "text": "Baal-hanan"
                    },
                    {
                        "id": 2,
                        "text": "Asherah"
                    }
                ]
            },
            {
                "id": 4,
                "book": 13,
                "text": "Shaved David's messengers",
                "answers": [
                    {
                        "id": 2,
                        "text": "Hadadezer"
                    },
                    {
                        "id": 1,
                        "text": "Hanun",
                        "correct": true
                    },
                    {
                        "id": 3,
                        "text": "Heli"
                    }
                ]
            },
            {
                "id": 5,
                "book": 1,
                "text": "Joseph's age when he died",
                "answers": [
                    {
                        "id": 3,
                        "text": "130 years"
                    },
                    {
                        "id": 1,
                        "text": "110 years",
                        "correct": true
                    },
                    {
                        "id": 2,
                        "text": "120 years"
                    }
                ]
            }
        ]
    };

    const game = new Game();
    game.seed = data.seed;
    game.index = data.index;
    game.qs = data.questions;
    return game;
}