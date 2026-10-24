#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { STATE_DIR } = require('../src/shared/paths');
const { connectable } = require('../src/adapters');
const { HOOK_PATH } = require('../src/adapters/claude-code/settings');

let electronOk = false;
try { electronOk = fs.existsSync(require('electron')); } catch { /* sin instalar */ }

const checks = [
  ['Node >= 18', Number(process.versions.node.split('.')[0]) >= 18, process.version],
  ['Electron installed', electronOk, 'run: npm run setup'],
  ['Hook script present', fs.existsSync(HOOK_PATH), HOOK_PATH],
  ...connectable().filter((a) => a.detect()).map((a) => [
    `${a.name} connected`, a.isConnected(), `run: npm run connect -- ${a.id}`,
  ]),
];

let failed = false;
for (const [name, ok, detail] of checks) {
  console.log(`${ok ? '✓' : '✗'} ${name}${ok ? '' : `  → ${detail}`}`);
  if (!ok) failed = true;
}
console.log(`State folder: ${STATE_DIR}`);
process.exit(failed ? 1 : 0);
