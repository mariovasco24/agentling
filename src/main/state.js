'use strict';

const { STATES, PRIORITY, STALE_MS, isState } = require('../shared/states');

/**
 * Combina el estado de todas las sesiones en uno solo.
 * @param {{state: string, mtimeMs: number}[]} sessions
 * @param {number} now
 */
function aggregate(sessions, now = Date.now()) {
  let best = STATES.IDLE;
  for (const session of sessions) {
    let state = isState(session.state) ? session.state : STATES.IDLE;
    if (STALE_MS[state] !== undefined && now - session.mtimeMs > STALE_MS[state]) state = STATES.IDLE;
    if (PRIORITY[state] > PRIORITY[best]) best = state;
  }
  return best;
}

module.exports = { aggregate };
