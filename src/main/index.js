'use strict';

const fs = require('fs');
const path = require('path');
const { app, ipcMain, shell, Tray } = require('electron');
const { STATE_DIR } = require('../shared/paths');
const { STATES } = require('../shared/states');
const { strings, pickLanguage } = require('../shared/i18n');
const { connectable } = require('../adapters');
const { createConfigStore } = require('./config');
const { listThemes, loadTheme } = require('./themes');
const { StateWatcher } = require('./state-watcher');
const { createPetWindow, resize } = require('./window');
const { buildMenu } = require('./menu');
const { trayIcon } = require('./tray-icon');
const { playAttention } = require('./sound');

const BUILTIN_THEMES = path.join(__dirname, '..', '..', 'themes');

function start() {
  if (app.dock) app.dock.hide();
  fs.mkdirSync(STATE_DIR, { recursive: true });

  const store = createConfigStore(path.join(app.getPath('userData'), 'config.json'));
  const userThemes = path.join(app.getPath('userData'), 'themes');
  fs.mkdirSync(userThemes, { recursive: true });

  const watcher = new StateWatcher({ dir: STATE_DIR });
  const t = () => strings(store.get().language || pickLanguage(app.getLocale()));
  const themes = () => listThemes([BUILTIN_THEMES, userThemes]);
  const payload = () => ({
    state: watcher.state, scale: store.get().scale, labels: t(), theme: loadTheme(themes(), store.get().theme),
  });

  const win = createPetWindow({
    position: store.get(),
    onMoved: (x, y) => store.set({ x, y }),
  });
  resize(win, store.get().scale);

  const tray = new Tray(trayIcon(STATES.IDLE));
  const canAutostart = process.platform === 'darwin' || process.platform === 'win32';
  const loginArgs = { path: process.execPath, args: [app.getAppPath()] };

  const actions = {
    toggle: () => (win.isVisible() ? win.hide() : win.showInactive()),
    quit: () => app.quit(),
    openThemes: () => shell.openPath(userThemes),
    connect: (agent) => { agent.connect(); refreshMenu(); },
    setScale: (scale) => { store.set({ scale }); resize(win, scale); win.webContents.send('scale', scale); refreshMenu(); },
    setSound: (sound) => { store.set({ sound }); },
    setTheme: (id) => { store.set({ theme: id }); win.webContents.send('theme', loadTheme(themes(), id)); refreshMenu(); },
    setAutostart: (openAtLogin) => app.setLoginItemSettings({ openAtLogin, ...loginArgs }),
  };

  const menu = () => buildMenu({
    t: t(), config: store.get(), themes: themes(), actions, canAutostart,
    pendingAgents: connectable().filter((a) => a.detect() && !a.isConnected()),
    autostart: canAutostart && app.getLoginItemSettings(loginArgs).openAtLogin,
  });
  function refreshMenu() { tray.setContextMenu(menu()); }
  refreshMenu();

  ipcMain.handle('app:init', payload);
  ipcMain.on('app:menu', () => menu().popup({ window: win }));

  watcher.on('change', (state, previous) => {
    win.webContents.send('state', state);
    tray.setImage(trayIcon(state));
    if (state === STATES.ATTENTION && previous !== STATES.ATTENTION && store.get().sound) playAttention();
  });
  watcher.start();
  tray.setImage(trayIcon(watcher.state));
}

if (app.requestSingleInstanceLock()) {
  app.whenReady().then(start);
  app.on('window-all-closed', () => app.quit());
} else {
  app.quit();
}
