#!/usr/bin/env node
'use strict';

/** Uso: node scripts/connect.js [agente…] [--disconnect]   (sin agente: todos los detectados) */

const { connectable } = require('../src/adapters');

const args = process.argv.slice(2);
const disconnect = args.includes('--disconnect');
const wanted = args.filter((a) => !a.startsWith('--'));
const targets = connectable().filter((a) => (wanted.length ? wanted.includes(a.id) : a.detect()));

if (targets.length === 0) {
  console.log(wanted.length
    ? `agentling: unknown agent "${wanted.join(', ')}". Available: ${connectable().map((a) => a.id).join(', ')}`
    : 'agentling: no supported agent detected. Use the generic command-line adapter (see src/adapters/README.md).');
  process.exit(wanted.length ? 1 : 0);
}

let failed = false;
for (const adapter of targets) {
  try {
    if (disconnect) adapter.disconnect(); else adapter.connect();
    console.log(`agentling: ${adapter.name} ${disconnect ? 'disconnected' : 'connected'} (${adapter.location?.() ?? 'ok'})`);
  } catch (err) {
    failed = true;
    console.error(`agentling: could not ${disconnect ? 'disconnect' : 'connect'} ${adapter.name}: ${err.message}`);
  }
}
if (!failed && !disconnect) console.log('Restart running agent sessions so they pick up the hooks, then run: npm start');
process.exit(failed ? 1 : 0);
