'use strict';

const { isState } = require('../shared/states');

/**
 * Adaptador para cualquier programa capaz de ejecutar un comando:
 * el evento es directamente el nombre del estado (idle | thinking | working | attention) o "end".
 */
module.exports = {
  id: 'generic',
  name: 'Any agent (command line)',

  translate(event, payload = {}) {
    const session = payload.session_id || 'default';
    if (event === 'end') return { session, state: null };
    return { session, state: isState(event) ? event : undefined };
  },
};
