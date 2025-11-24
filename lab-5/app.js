import './ui.js';
import { store } from './store.js';

const on = (id, evt, handler) =>
    document.getElementById(id).addEventListener(evt, handler);

on('addSquare', 'click', () => store.addShape('square'));
on('addCircle', 'click', () => store.addShape('circle'));

on('recolorSquares', 'click', () => store.recolor('square'));
on('recolorCircles', 'click', () => store.recolor('circle'));
