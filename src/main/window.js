'use strict';

const path = require('path');
const { BrowserWindow, screen } = require('electron');

const BASE_SIZE = Object.freeze({ width: 200, height: 230 });
const MARGIN = 30;

const inside = (r, x, y) => x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height;

/** Si la posición guardada ya no cae en ninguna pantalla (monitor desconectado), usa la esquina inferior derecha. */
function resolvePosition(saved) {
  const { workArea } = screen.getPrimaryDisplay();
  const fallback = {
    x: workArea.x + workArea.width - BASE_SIZE.width - MARGIN,
    y: workArea.y + workArea.height - BASE_SIZE.height - MARGIN,
  };
  if (saved.x === null || saved.y === null) return fallback;
  const cx = saved.x + BASE_SIZE.width / 2;
  const cy = saved.y + BASE_SIZE.height / 2;
  return screen.getAllDisplays().some((d) => inside(d.workArea, cx, cy)) ? saved : fallback;
}

function createPetWindow({ position, onMoved }) {
  const { x, y } = resolvePosition(position);
  const win = new BrowserWindow({
    ...BASE_SIZE, x, y,
    transparent: true, frame: false, hasShadow: false, resizable: false,
    alwaysOnTop: true, skipTaskbar: true, focusable: false, fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  win.on('moved', () => onMoved(...win.getPosition()));
  return win;
}

function resize(win, scale) {
  win.setContentSize(Math.round(BASE_SIZE.width * scale), Math.round(BASE_SIZE.height * scale));
}

module.exports = { createPetWindow, resize };
