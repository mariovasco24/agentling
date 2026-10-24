'use strict';

/** Estados posibles de la mascota. Los nombres también se usan como contenido de los archivos de estado. */
const STATES = Object.freeze({
  IDLE: 'idle',
  THINKING: 'thinking',
  WORKING: 'working',
  ATTENTION: 'attention',
});

/** Con varias sesiones abiertas gana el estado de mayor prioridad. */
const PRIORITY = Object.freeze({ idle: 0, thinking: 1, working: 2, attention: 3 });

/**
 * Claude Code no avisa cuando se interrumpe con Esc, así que "pensando" y
 * "trabajando" caducan y vuelven a "idle" si no llegan señales nuevas.
 */
const STALE_MS = Object.freeze({ thinking: 5 * 60 * 1000, working: 5 * 60 * 1000 });

function isState(value) {
  return Object.prototype.hasOwnProperty.call(PRIORITY, value);
}

module.exports = { STATES, PRIORITY, STALE_MS, isState };
