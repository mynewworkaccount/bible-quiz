const LOADER = $("loader");
const GAME_SCREEN = $("main");
const QUESTION = $("main content");
const ERROR_SCREEN = $("on-error");
const ERROR_BUTTON = $("on-error button");
const GAMEOVER_SCREEN = $("game-over");
const GAMEOVER_SCORE = $("game-over score");
const SHARE_BUTTON = $("game-over button[share]");
const REPLAY_BUTTON = $("game-over button[replay]");
const GAMEOVER_TEXT = $("game-over score-text");
const ABOUTUS_BUTTON = $("main header button");
const BUTTONS = document.querySelectorAll("main footer button");

const CACHE = "game-state";

const game = new Game();

addEventListener("online", checkOnline);
addEventListener("offline", checkOnline);
addEventListener("beforeunload", cacheState);
addEventListener("DOMContentLoaded", clickEvents);
addEventListener("load", async () => {
    loadStateCache();
    startGame();
    //await navigator.serviceWorker.register("sw.js");
});

function startGame() {
    if (game.over) {
        game.reset();
    }

    downloadState().then(state => {
        game.seed = state.seed;
        game.index = state.index;
        game.qs = state.questions;
        cacheState();
        render();
    })
    .catch(() => {
        show(ERROR_SCREEN);
    });
}

async function downloadState() {
    loading(true);
    const url = "http://localhost/q/questions";
    const response = await fetch(url + `?seed=${game.seed}&index=${game.index}`);
    loading(false);

    if (response.ok) {
        return response.json();
    }
    
    throw new Error(response);
}

async function playAgain() {
    show(GAME_SCREEN);
    hide(ERROR_SCREEN);
    hide(GAMEOVER_SCREEN);
    delete GAMEOVER_SCREEN.dataset.win;
    await startGame();
}

function render() {
    const q = game.q;
    QUESTION.textContent = q.text;
    q.answers.forEach((answer, i) => {
        BUTTONS[i].disabled = false;
        BUTTONS[i].dataset.q = q.id;
        BUTTONS[i].dataset.answer = answer.id;
        BUTTONS[i].textContent = answer.text;
        delete BUTTONS[i].dataset.correct;
    });
}

function gameover() {
    const total = game.total;
    const correct = game.score;
    const win = correct == total;

    if (win) {
        game.wins ++;
    }

    cacheState();
    hide(GAME_SCREEN);
    show(GAMEOVER_SCREEN);
    GAMEOVER_SCREEN.dataset.win = win;
    GAMEOVER_TEXT.textContent = `YOU ${win ? "WIN" : "LOSE"}`;
    GAMEOVER_SCORE.textContent = `${correct} / ${total}`;
}

function onSelect() {
    const q = this.dataset.q;
    const answer = this.dataset.answer;
    this.dataset.correct = game.answer(q, answer);

    BUTTONS.forEach(e => e.disabled = true);

    requestAnimationFrame(() => {
        setTimeout(() => {
            
            game.next();

            if (game.over) {
                gameover();
                return;
            }

            render();
            
        }, 500);
    });
}

function clickEvents() {
    ERROR_BUTTON.addEventListener("click", playAgain);
    REPLAY_BUTTON.addEventListener("click", playAgain);
    BUTTONS.forEach(e => e.addEventListener("click", throttle(onSelect, 800)));

    if (navigator.share) {
        show(SHARE_BUTTON);
        SHARE_BUTTON.addEventListener("click", async () => {
            await navigator.share({
                title: 'Tough Bible Quiz',
                text: 'Challenge yourself with our super tough Bible quiz',
                url: 'https://q.chikuse.co.za',
            });
        });
    }
}

function cacheState() {
    localStorage.setItem(CACHE, JSON.stringify(game));
}

function loadStateCache() {
    const json = localStorage.getItem(CACHE);
    if (json) {
        const state = JSON.parse(json);
        Object.assign(game, state);
    }
}

function show(e) {
    e.removeAttribute("cloak");
}

function hide(e) {
    e.setAttribute("cloak", "");
}

function loading(busy) {
    if (busy) 
    show(LOADER);
    
    else 
    hide(LOADER);
}

function checkOnline() {
    if (navigator.onLine) {
        REPLAY_BUTTON.disabled = false;
        REPLAY_BUTTON.textContent = 'PLAY AGAIN';
    }
    else {
        REPLAY_BUTTON.disabled = true;
        REPLAY_BUTTON.textContent = 'GO ONLINE TO PLAY';
    }
}

function throttle(callback, limit) {
    let wait = false;
    return function () {
        if (!wait) {
            callback.apply(this, arguments);
            wait = true;
            setTimeout(() => {
                wait = false;
            }, limit);
        }
    };
}

function $(e) {
    return document.querySelector(e);
}