'use strict';

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const { STATES } = require('../shared/states');
const { aggregate } = require('./state');

/** Lee la carpeta de estados cada pocos cientos de ms y emite `change(state, previous)`. */
class StateWatcher extends EventEmitter {
  constructor({ dir, intervalMs = 400 }) {
    super();
    this.dir = dir;
    this.intervalMs = intervalMs;
    this.state = STATES.IDLE;
    this.timer = null;
  }

  readSessions() {
    let names = [];
    try { names = fs.readdirSync(this.dir); } catch { return []; }
    const sessions = [];
    for (const name of names) {
      if (name.endsWith('.tmp')) continue;
      const file = path.join(this.dir, name);
      try {
        sessions.push({
          state: fs.readFileSync(file, 'utf8').trim(),
          mtimeMs: fs.statSync(file).mtimeMs,
        });
      } catch { /* el hook acaba de borrar la sesión */ }
    }
    return sessions;
  }

  poll() {
    const next = aggregate(this.readSessions());
    if (next === this.state) return;
    const previous = this.state;
    this.state = next;
    this.emit('change', next, previous);
  }

  start() {
    this.poll();
    this.timer = setInterval(() => this.poll(), this.intervalMs);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

module.exports = { StateWatcher };
