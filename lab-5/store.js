import { randomHsl } from './helpers.js';

export class ShapeStore {
    #state = { shapes: [] };
    #subscribers = new Map();

    constructor() {
        const raw = localStorage.getItem('shapes');
        this.#state.shapes = raw ? JSON.parse(raw) : [];
    }

    getShapes() {
        return Array.from(this.#state.shapes);
    }

    subscribe(prop, callback) {
        if (!this.#subscribers.has(prop)) {
            this.#subscribers.set(prop, new Set());
        }
        this.#subscribers.get(prop).add(callback);
        callback(this.#state[prop]);
        return () => this.#subscribers.get(prop).delete(callback);
    }

    addShape(type) {
        const id = crypto.randomUUID();
        const color = randomHsl();
        const shape = { id, type, color };
        this.#state.shapes.push(shape);
        this.#saveAndNotify();
    }

    removeShape(id) {
        this.#state.shapes = this.#state.shapes.filter(s => s.id !== id);
        this.#saveAndNotify();
    }

    recolor(type) {
        this.#state.shapes = this.#state.shapes.map(s =>
            s.type === type ? { ...s, color: randomHsl() } : s
        );
        this.#saveAndNotify();
    }

    count(type) {
        return this.#state.shapes.filter(s => s.type === type).length;
    }

    #saveAndNotify() {
        localStorage.setItem('shapes', JSON.stringify(this.#state.shapes));
        this.#notify('shapes');
    }

    #notify(prop) {
        const subs = this.#subscribers.get(prop);
        if (!subs) return;
        for (const cb of subs) {
            try {
                cb(this.#state[prop]);
            } catch (e) {
                console.error('Subscriber callback error', e);
            }
        }
    }
}

export const store = new ShapeStore();
