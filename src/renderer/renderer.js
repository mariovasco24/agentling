'use strict';

const $ = (id) => document.getElementById(id);
const BUBBLES = { thinking: ['.', '..', '...'], attention: ['!'] };

let state = 'idle';
let labels = {};
let tick = 0;

function renderState() {
  document.body.dataset.state = state;
  $('character').dataset.state = state; // los temas leen el estado con :host([data-state="…"])
  $('label').textContent = labels[state] || '';
  const bubble = $('bubble');
  const frames = BUBBLES[state];
  bubble.hidden = !frames;
  if (frames) bubble.textContent = frames[tick % frames.length];
}

/** Cada tema vive en su propio shadow root: sus estilos no pueden afectar a la app ni a otros temas. */
function applyTheme(theme) {
  if (!theme) return;
  const host = $('character');
  const root = host.shadowRoot || host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = theme.css;
  const body = document.createElement('template');
  body.innerHTML = theme.html;
  root.replaceChildren(style, body.content);
}

function applyScale(scale) {
  $('root').style.transform = `scale(${scale})`;
}

window.pet.onState((next) => { state = next; renderState(); });
window.pet.onScale(applyScale);
window.pet.onTheme(applyTheme);
document.addEventListener('contextmenu', (event) => { event.preventDefault(); window.pet.openMenu(); });
setInterval(() => { tick += 1; renderState(); }, 450);

window.pet.init().then((init) => {
  state = init.state;
  labels = init.labels;
  applyScale(init.scale);
  applyTheme(init.theme);
  renderState();
});
