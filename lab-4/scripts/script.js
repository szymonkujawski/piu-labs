const kanbanBoard = document.querySelector('#board');
const LS_KEY = 'kanbanStorageData';

const generateId = () => 'id_' + Math.random().toString(36).substring(2, 10);
const randomHue = () => `hsl(${Math.floor(Math.random() * 360)}, 60%, 70%)`;

function createCard(titleText, columnKey, cardId, bgColor) {
    const cardBox = document.createElement('div');
    cardBox.classList.add('card');
    cardBox.dataset.col = columnKey;
    cardBox.id = cardId || generateId();
    cardBox.style.background = bgColor || randomHue();

    const title = document.createElement('h4');
    title.contentEditable = 'true';
    title.innerText = titleText || 'Nowe zadanie';
    cardBox.appendChild(title);

    const btnPanel = document.createElement('div');
    btnPanel.className = 'card-buttons';

    const btnLeft = makeButton('←', 'shift');
    const btnRight = makeButton('→', 'shift');
    const btnDelete = makeButton('X', 'delete');
    const btnColor = makeButton('Koloruj', 'colorize');

    btnPanel.append(btnLeft, btnRight, btnDelete, btnColor);
    cardBox.appendChild(btnPanel);

    const column = document.querySelector(
        `section[data-col="${columnKey}"] .cards`
    );
    column.append(cardBox);

    refreshAll();
}

function makeButton(text, className) {
    const btn = document.createElement('button');
    btn.className = className;
    btn.innerText = text;
    return btn;
}

function saveData() {
    const cards = [...document.querySelectorAll('.card')].map((c) => ({
        id: c.id,
        title: c.querySelector('h4').innerText,
        column: c.dataset.col,
        color: c.style.background,
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(cards));
}

function loadData() {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    saved.forEach((item) =>
        createCard(item.title, item.column, item.id, item.color)
    );
}

function updateCardCounters() {
    document.querySelectorAll('section').forEach((col) => {
        const count = col.querySelectorAll('.card').length;
        col.querySelector('.cardCount').textContent = `Karty: ${count}`;
    });
}

function refreshAll() {
    updateCardCounters();
    saveData();
}

function sortCards(columnEl) {
    const list = [...columnEl.querySelectorAll('.card')];
    list.sort((a, b) =>
        a
            .querySelector('h4')
            .innerText.localeCompare(b.querySelector('h4').innerText)
    );
    const container = columnEl.querySelector('.cards');
    list.forEach((el) => container.append(el));
    refreshAll();
}

function colorizeColumn(columnEl) {
    const color = randomHue();
    columnEl
        .querySelectorAll('.card')
        .forEach((c) => (c.style.background = color));
    refreshAll();
}

kanbanBoard.addEventListener('click', (e) => {
    const colEl = e.target.closest('section');
    const btn = e.target;

    if (!colEl) return;

    if (btn.classList.contains('add')) {
        createCard('Nowe zadanie', colEl.dataset.col);
    }

    if (btn.classList.contains('sort')) {
        sortCards(colEl);
    }

    if (btn.classList.contains('paint')) {
        colorizeColumn(colEl);
    }

    if (btn.classList.contains('delete')) {
        btn.closest('.card').remove();
        refreshAll();
    }

    if (btn.classList.contains('colorize')) {
        btn.closest('.card').style.background = randomHue();
        refreshAll();
    }

    if (btn.classList.contains('shift')) {
        const card = btn.closest('.card');
        const current = card.dataset.col;

        if (btn.innerText.includes('→') && current !== 'done') {
            card.dataset.col = current === 'todo' ? 'doing' : 'done';
        } else if (btn.innerText.includes('←') && current !== 'todo') {
            card.dataset.col = current === 'done' ? 'doing' : 'todo';
        }

        document
            .querySelector(`section[data-col="${card.dataset.col}"] .cards`)
            .append(card);

        refreshAll();
    }
});

kanbanBoard.addEventListener('input', saveData);

loadData();
refreshAll();
