'use strict';

const { execFile } = require('child_process');
const { shell } = require('electron');

/** Aviso sonoro cuando Claude necesita algo del usuario. */
function playAttention() {
  if (process.platform === 'darwin') {
    execFile('afplay', ['/System/Library/Sounds/Ping.aiff'], () => {});
  } else {
    shell.beep();
  }
}

module.exports = { playAttention };
