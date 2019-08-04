const main = document.querySelector('main');
const loader = document.querySelector('loader');
const status = document.querySelector('header i');
const content = document.querySelector('content');
const buttons = document.querySelectorAll('button');
let counter = 0;
let qs = [];

window.addEventListener('load', async () => {
    qs = await load();
    listen();
    next();

    await navigator.serviceWorker.register('sw.js');
});

function listen() {
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const q = this.getAttribute('q');
            const answer = this.getAttribute('answer');
            pick(q, answer);
            setTimeout(() => {
                status.removeAttribute('data-correct');
                next();
            }, 600);
        });
    });
}

function pick(id, selected) {
    const q = qs.find(i => i.id == id);
    const answer = q.answers.find(i => i.correct);
    const correct = answer.id == selected;
    q.correct = correct;
    q.selectedAnswer = selected;
    status.setAttribute('data-correct', correct);
    status.textContent = correct ? 'check' : 'close';
}

function render(q) {
    content.textContent = q.text;
    q.answers.forEach((answer, i) => {
        buttons[i].textContent = answer.text;
        buttons[i].setAttribute('q', q.id);
        buttons[i].setAttribute('answer', answer.id);
    });
}

function next() {
    if (counter == qs.length) {
        const total = qs.length;
        const correct = qs.filter(i => i.correct).length;
        gameover(correct, total);
    }
    else {
        render(qs[counter]);
        counter++;
    }
}

function gameover(correct, total) {
    hide(main);
    const tmpl = document.getElementsByTagName("template")[0];
    document.body.appendChild(tmpl.content.cloneNode(true));
    const root = document.querySelector('game-over');
    const result = correct == total ? 'WIN' : 'LOSE';
    root.querySelector('.text').textContent = `GAME OVER. YOU ${result}`;
    root.querySelector('.score').textContent = `${correct} / ${total}`;
    root.querySelector('.action-button').addEventListener('click', () => {
        window.location.reload();
    });
}

async function load() {
    const response = await fetch('https://chikuse.co.za/q/api/questions');
    const json = await response.json();
    show(main);
    hide(loader);
    return json.questions;
}

function show(e) {
    e.removeAttribute('cloak');
}

function hide(e) {
    e.setAttribute('cloak', '');
}