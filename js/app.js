const show = e => e.removeAttribute("cloak");
const hide = e => e.setAttribute("cloak", "");
const $ = e => document.querySelector(e);

const BODY = $("body");
const LOADER = $("loader");
const GAME_SCREEN = $("main");
const QUESTION_TEXT = $("main content");
const ABOUT_SCREEN = $("about-us");
const ABOUT_BUTTON = $("main header [about]");
const GAMEOVER_SCREEN = $("game-over");
const GAMEOVER_SCORE = $("game-over score");
const GAMEOVER_BUTTON = $("game-over [replay]");
const GAMEOVER_TEXT = $("game-over score-text");
const BUTTONS = document.querySelectorAll("main footer button");

const API = "http://localhost/q/questions"
let counter = 0;
let qs = [];

const game = createGame();
addEventListener("load", startGame);
addEventListener("online", checkOnlineStatus);
addEventListener("offline", checkOnlineStatus);
addEventListener("DOMContentLoaded", addClickEvents);

function createGame() {
    const g = new Game();
    const KEY = "game-state";
    const json = localStorage.getItem(KEY);
    if (json) {
        Object.assign(g, JSON.parse(json));
    }

    return new Proxy(g, {
        set(target, key, value) {
            target[key] = value;
            localStorage.setItem(KEY, JSON.stringify(g));
            return true;
        }
    });
}

async function startGame() {
    if (game.over) {
        hide(LOADER);
        hide(GAME_SCREEN);
        show(GAMEOVER_SCREEN);

        checkOnlineStatus();

        GAMEOVER_TEXT.textContent = game.score;
        GAMEOVER_SCORE.textContent = game.scoreText;
        return;
    }

    counter = 0;

    await fetchQuestions();

    gotoNextQuestion();

    await navigator.serviceWorker.register("sw.js");
}

function addClickEvents() {
    GAMEOVER_BUTTON.addEventListener("click", playAgain);

    ABOUT_BUTTON.addEventListener("click", () => {
        show(ABOUT_SCREEN);
    });

    ABOUT_SCREEN.addEventListener("click", () => {
        hide(ABOUT_SCREEN);
    });

    BUTTONS.forEach(button => {
        button.addEventListener("click", function () {
            const q = this.getAttribute("q");
            const answer = this.getAttribute("answer");
            const correct = answerSelected(q, answer);

            requestAnimationFrame(() => {
                setTimeout(() => {
                    BODY.setAttribute("data-correct", correct);
                }, 400);
            });

            requestAnimationFrame(() => {
                setTimeout(() => {
                    BODY.removeAttribute("data-correct");
                    gotoNextQuestion();
                }, 1000);
            });
        });
    });
}

function answerSelected(id, selected) {
    const q = qs.find(i => i.id == id);
    const answer = q.answers.find(i => i.correct);
    const correct = answer.id == selected;
    q.selectedAnswer = selected;
    q.correct = correct;
    return correct;
}

function gotoNextQuestion() {
    if (counter == qs.length) {
        const total = qs.length;
        const correct = qs.filter(i => i.correct).length;
        gameover(correct, total);
        return;
    }

    const q = qs[counter];
    QUESTION_TEXT.textContent = q.text;
    q.answers.forEach((answer, i) => {
        BUTTONS[i].textContent = answer.text;
        BUTTONS[i].setAttribute("q", q.id);
        BUTTONS[i].setAttribute("answer", answer.id);
    });

    counter++;
}

function gameover(correct, total) {
    hide(GAME_SCREEN);
    show(GAMEOVER_SCREEN);

    const result = correct == total ? "WIN" : "LOSE";
    const scoreText = `GAME OVER. YOU ${result}`;
    const score = `${correct} / ${total}`;

    GAMEOVER_SCORE.textContent = score;
    GAMEOVER_TEXT.textContent = scoreText;

    game.over = true;
    game.score = score;
    game.scoreText = scoreText;
}

function playAgain() {
    if (game.reset) {
        counter = 0;
        game.index = 0;
        game.seed = 0;
    }
    else {
        game.index = game.index + 1;
    }

    show(LOADER);
    hide(GAMEOVER_SCREEN);
    game.over = false;
    dispatchEvent(new Event("load"));
}

async function fetchQuestions() {
    loading(true);
    const query = `?seed=${game.seed}&index=${game.index}`;
    const response = await fetch(API + query);
    const json = await response.json();
    loading(false);

    game.seed = json.seed;
    game.index = json.index;
    game.reset = json.reset;
    qs = json.questions;
}

function loading(state) {
    if (state) {
        hide(GAME_SCREEN);
        show(LOADER);
    }
    else {
        show(GAME_SCREEN);
        hide(LOADER);
    }
}

function checkOnlineStatus() {
    if (game.offline)
        BODY.setAttribute("data-offline", true);

    else
        BODY.removeAttribute("data-offline");
}