'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const on = (channel) => (callback) => ipcRenderer.on(channel, (_event, value) => callback(value));

contextBridge.exposeInMainWorld('pet', {
  init: () => ipcRenderer.invoke('app:init'),
  onState: on('state'),
  onScale: on('scale'),
  onTheme: on('theme'),
  openMenu: () => ipcRenderer.send('app:menu'),
});
