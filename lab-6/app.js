import Ajax from './ajax.js';

const ajax = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 6000,
});

const fetchBtn = document.getElementById('fetchBtn');
const errorBtn = document.getElementById('errorBtn');
const resetBtn = document.getElementById('resetBtn');
const loader = document.getElementById('loader');
const error = document.getElementById('error');
const list = document.getElementById('list');

fetchBtn.addEventListener('click', () => loadPosts());
errorBtn.addEventListener('click', () => triggerError());
resetBtn.addEventListener('click', () => reset());

async function loadPosts() {
    showLoader();
    hideError();
    list.innerHTML = '';
    fetchBtn.disabled = true;
    errorBtn.disabled = true;

    try {
        const posts = await ajax.get('/posts?_limit=10');
        displayPosts(posts);
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoader();
        fetchBtn.disabled = false;
        errorBtn.disabled = false;
    }
}

async function triggerError() {
    showLoader();
    hideError();
    list.innerHTML = '';
    fetchBtn.disabled = true;
    errorBtn.disabled = true;

    try {
        await ajax.get('/posts/99999');
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoader();
        fetchBtn.disabled = false;
        errorBtn.disabled = false;
    }
}

async function loadPostsWithDelay() {
    showLoader();
    hideError();
    list.innerHTML = '';
    fetchBtn.disabled = true;
    errorBtn.disabled = true;

    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
        const posts = await ajax.get('/posts?_limit=10');
        displayPosts(posts);
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoader();
        fetchBtn.disabled = false;
        errorBtn.disabled = false;
    }
}

function displayPosts(posts) {
    posts.forEach((post) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
      <div class="title">${escapeHtml(post.title)}</div>
      <div class="body">${escapeHtml(post.body)}</div>
      <div class="meta">ID: ${post.id} | User: ${post.userId}</div>
    `;
        list.appendChild(div);
    });
}

function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function reset() {
    list.innerHTML = '';
    hideError();
    hideLoader();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const delayBtn = document.createElement('button');
    delayBtn.id = 'delayBtn';
    delayBtn.textContent = 'Pobierz dane (z opóźnieniem)';
    delayBtn.addEventListener('click', () => loadPostsWithDelay());

    const controls = document.querySelector('.controls');
    controls.insertBefore(delayBtn, errorBtn);
});