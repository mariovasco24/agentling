'use strict';

const os = require('os');
const path = require('path');

/** Carpeta donde los adaptadores dejan un archivo por sesión con su estado actual. */
const STATE_DIR = process.env.AGENTLING_STATE_DIR || path.join(os.homedir(), '.agentling', 'state');

module.exports = { STATE_DIR };
