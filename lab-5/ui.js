import { store } from './store.js';

const board = document.getElementById('board');
const cntSquares = document.getElementById('cntSquares');
const cntCircles = document.getElementById('cntCircles');

function createShapeElement(shape) {
    const el = document.createElement('div');
    el.className = `shape ${shape.type}`;
    el.dataset.id = shape.id;
    el.style.backgroundColor = shape.color;
    return el;
}

const render = function (shapes) {
    const list = Array.isArray(shapes) ? shapes : [];

    const existingIds = new Set();
    for (const child of board.children) {
        if (child.dataset && child.dataset.id) existingIds.add(child.dataset.id);
    }

    for (const s of list) {
        if (!existingIds.has(s.id)) {
            board.appendChild(createShapeElement(s));
        } else {
            const found = board.querySelector(`[data-id="${s.id}"]`);
            if (found && found.style.backgroundColor !== s.color) {
                found.style.backgroundColor = s.color;
            }
        }
    }

    for (let i = board.children.length - 1; i >= 0; i--) {
        const child = board.children[i];
        const id = child.dataset && child.dataset.id;
        if (!list.find(s => s.id === id)) {
            board.removeChild(child);
        }
    }

    cntSquares.textContent = store.count('square');
    cntCircles.textContent = store.count('circle');
};

board.addEventListener('click', (event) => {
    const target = event.target.closest('.shape');
    if (!target) return;
    const id = target.dataset.id;
    if (!id) return;
    store.removeShape(id);
});

store.subscribe('shapes', render);
