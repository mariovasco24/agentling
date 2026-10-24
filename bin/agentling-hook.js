#!/usr/bin/env node
'use strict';

/**
 * Uso: agentling-hook.js <adaptador> <evento>   (el JSON del agente llega por stdin, opcional)
 * Traduce el evento con el adaptador y escribe el estado de la sesión en STATE_DIR.
 * Solo lee lo que el adaptador necesita (p. ej. `session_id`, `tool_name`), no usa la red
 * y siempre termina con código 0 para no interferir con el agente.
 */

const fs = require('fs');
const path = require('path');
const { STATE_DIR } = require('../src/shared/paths');
const { getAdapter } = require('../src/adapters');

const PRUNE_AFTER_MS = 2 * 60 * 60 * 1000;

/** El id de sesión se usa como nombre de archivo: solo caracteres seguros. */
const safeId = (id) => String(id || 'unknown').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80);

function handle(adapterId, event, payload = {}, dir = STATE_DIR, now = Date.now()) {
  const adapter = getAdapter(adapterId);
  if (!adapter) return;
  const { session, state } = adapter.translate(event, payload);
  if (state === undefined) return;
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${adapter.id}__${safeId(session)}`);
  if (state === null) {
    fs.rmSync(file, { force: true });
  } else {
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, state);
    fs.renameSync(tmp, file); // escritura atómica: el lector nunca ve un archivo a medias
  }
  prune(dir, now);
}

function prune(dir, now) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    try {
      if (now - fs.statSync(file).mtimeMs > PRUNE_AFTER_MS) fs.rmSync(file, { force: true });
    } catch { /* otro proceso ya lo borró */ }
  }
}

function readStdin() {
  if (process.stdin.isTTY) return Promise.resolve('');
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
  });
}

async function main() {
  let payload = {};
  try { payload = JSON.parse(await readStdin()); } catch { /* sin JSON válido: payload vacío */ }
  try { handle(process.argv[2], process.argv[3], payload); } catch { /* nunca romper al agente */ }
}

if (require.main === module) main();

module.exports = { handle, safeId };
