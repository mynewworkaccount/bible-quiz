const BODY = $("body");
const LOADER = $("loader");
const GAME_SCREEN = $("main");
const FOOTER = $("main footer");
const QUESTION = $("main content");
const ABOUTUS_SCREEN = $("about-us");
const GAMEOVER_SCREEN = $("game-over");
const GAMEOVER_SCORE = $("game-over score");
const SHARE_BUTTON  = $("game-over button[share]");
const REPLAY_BUTTON = $("game-over button[replay]");
const GAMEOVER_TEXT = $("game-over score-text");
const ABOUTUS_BUTTON = $("main header button");
const BUTTONS = document.querySelectorAll("main footer button");
const URL = "http://localhost/q/questions";

const game = new Game();

addEventListener("load", startGame);
addEventListener("online", checkOnline);
addEventListener("offline", checkOnline);
addEventListener("DOMContentLoaded", () => {
    REPLAY_BUTTON .addEventListener("click", playAgain);
    ABOUTUS_BUTTON.addEventListener("click", () => show(ABOUTUS_SCREEN));
    ABOUTUS_SCREEN.addEventListener("click", () => hide(ABOUTUS_SCREEN));
    BUTTONS.forEach(e => e.addEventListener("click", throttle(onSelect, 800)));

    if(navigator.share) {
        show(SHARE_BUTTON);
        SHARE_BUTTON.addEventListener("click", share);
    }
});
addEventListener("load", async () => {
    //await navigator.serviceWorker.register("sw.js");
});

async function startGame() {
    if (game.over) {
        game.reset();
    }

    const state = await downloadQuestions();
    game.update(state);
    render(game.q);
}

async function downloadQuestions() {
    loading(true);
    const response = await fetch(URL + `?seed=${game.seed}&index=${game.index}`);
    const json = await response.json();
    loading(false);
    return json;
}

async function playAgain() {
    game.reset();
    show(GAME_SCREEN);
    hide(GAMEOVER_SCREEN);
    await startGame();
}

async function share() {
    await navigator.share({
        title: 'Tough Bible Quiz',
        text: 'Challenge yourself with our super tough Bible quiz',
        url: 'https://q.chikuse.co.za',
    });
}

function render(q) {
    QUESTION.textContent = q.text;
    q.answers.forEach((answer, i) => {
        BUTTONS[i].dataset.q = q.id;
        BUTTONS[i].textContent = answer.text;
        BUTTONS[i].dataset.answer = answer.id;
        BUTTONS[i].removeAttribute("data-correct");
    });
}

function gameover() {
    const total = game.total;
    const correct = game.score;
    const win = correct == total;

    if(win) {
        game.wins();
    }

    game.save();

    hide(GAME_SCREEN);
    show(GAMEOVER_SCREEN);
    GAMEOVER_SCORE.textContent = `${correct} / ${total}`;
    GAMEOVER_TEXT.textContent = `YOU ${ win ? "WIN" : "LOSE" }`;
}

function onSelect() {
    const ds = this.dataset;

    ds.correct = game.answer(ds.q, ds.answer);
    
    requestAnimationFrame(() => {
        setTimeout(() => {

            game.next();

            if (game.over) {
                gameover();
                return;
            }

            render(game.q);

        }, 500);
    }); 
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

function show(e) {
    e.removeAttribute("cloak");
}

function hide(e) {
    e.setAttribute("cloak", "");
}

function loading(state) {
    if (state)  
    BODY.dataset.loading = true;
    
    else 
    delete BODY.dataset.loading;
}

function checkOnline() {
    if(navigator.onLine) {
        REPLAY_BUTTON.removeAttribute("disabled");
        REPLAY_BUTTON.textContent = 'PLAY AGAIN';
    }
    else {
        REPLAY_BUTTON.setAttribute("disabled", true);
        REPLAY_BUTTON.textContent = 'GO ONLINE TO PLAY';
    }
}

function $(e) {
    return document.querySelector(e);
}