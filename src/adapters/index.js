'use strict';

const claudeCode = require('./claude-code');
const generic = require('./generic');

/** Para añadir un agente nuevo: crear su adaptador (ver README.md de esta carpeta) y listarlo aquí. */
const adapters = [claudeCode, generic];

const getAdapter = (id) => adapters.find((a) => a.id === id);

/** Adaptadores que se pueden conectar automáticamente (tienen connect()). */
const connectable = () => adapters.filter((a) => typeof a.connect === 'function');

module.exports = { adapters, getAdapter, connectable };
