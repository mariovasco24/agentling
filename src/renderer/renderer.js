'use strict';

const $ = (id) => document.getElementById(id);
const BUBBLES = { thinking: ['.', '..', '...'], attention: ['!'] };

let state = 'idle';
let labels = {};
let tick = 0;
let themeStyle = null;

function renderState() {
  document.body.dataset.state = state;
  $('label').textContent = labels[state] || '';
  const bubble = $('bubble');
  const frames = BUBBLES[state];
  bubble.hidden = !frames;
  if (frames) bubble.textContent = frames[tick % frames.length];
}

function applyTheme(theme) {
  if (!theme) return;
  themeStyle?.remove();
  themeStyle = document.createElement('style');
  themeStyle.textContent = theme.css;
  document.head.appendChild(themeStyle);
  $('character').innerHTML = theme.html;
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
