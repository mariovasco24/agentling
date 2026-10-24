'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { addHooks, removeHooks, hasHooks, EVENTS, installHooks, uninstallHooks, hooksInstalled } = require('../src/adapters/claude-code/settings');
const adapter = require('../src/adapters/claude-code');
const generic = require('../src/adapters/generic');

const other = { type: 'command', command: '~/.claude/otro-hook.sh' };
const existing = {
  theme: 'dark',
  hooks: { Stop: [{ hooks: [other] }], PreToolUse: [{ matcher: 'Bash', hooks: [other] }] },
};

test('añade un hook por evento sin tocar los existentes', () => {
  const next = addHooks(existing);
  assert.equal(next.theme, 'dark');
  for (const [event] of EVENTS) assert.ok(next.hooks[event].length >= 1, event);
  assert.deepEqual(next.hooks.Stop[0], { hooks: [other] });
  assert.equal(next.hooks.Stop.length, 2);
  assert.equal(hasHooks(next), true);
});

test('es idempotente: instalar dos veces no duplica', () => {
  const once = addHooks(existing);
  assert.deepEqual(addHooks(once), once);
});

test('desinstalar deja los ajustes como estaban', () => {
  assert.deepEqual(removeHooks(addHooks(existing)), existing);
  assert.deepEqual(removeHooks(addHooks({})), {});
});

test('la notificación solo se activa con permisos y preguntas', () => {
  const group = addHooks({}).hooks.Notification[0];
  assert.equal(group.matcher, 'permission_prompt|elicitation_dialog');
});

test('el archivo: crea copia de seguridad una sola vez y no escribe si el JSON es inválido', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentling-'));
  const file = path.join(dir, 'settings.json');
  fs.writeFileSync(file, JSON.stringify(existing));
  installHooks(file);
  installHooks(file);
  assert.equal(hooksInstalled(file), true);
  assert.deepEqual(JSON.parse(fs.readFileSync(`${file}.bak-agentling`, 'utf8')), existing);
  uninstallHooks(file);
  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), existing);

  fs.writeFileSync(file, '{ roto');
  assert.throws(() => installHooks(file));
  assert.equal(fs.readFileSync(file, 'utf8'), '{ roto');
});

test('instalar en un settings.json que no existe lo crea', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentling-'));
  const file = path.join(dir, 'nuevo', 'settings.json');
  installHooks(file);
  assert.equal(hooksInstalled(file), true);
});

test('traducción de eventos de Claude Code', () => {
  const state = (event, payload) => adapter.translate(event, payload).state;
  assert.equal(state('prompt'), 'thinking');
  assert.equal(state('pre-tool', { tool_name: 'Bash' }), 'working');
  assert.equal(state('pre-tool', { tool_name: 'AskUserQuestion' }), 'attention');
  assert.equal(state('post-tool'), 'thinking');
  assert.equal(state('attention'), 'attention');
  assert.equal(state('stop'), 'idle');
  assert.equal(state('end'), null);
  assert.equal(state('nope'), undefined);
  assert.equal(adapter.translate('prompt', { session_id: 'abc' }).session, 'abc');
});

test('los comandos instalados identifican al adaptador', () => {
  const command = addHooks({}).hooks.Stop[0].hooks[0].command;
  assert.match(command, /agentling-hook\.js" claude-code stop$/);
});

test('adaptador genérico: el evento es el estado', () => {
  assert.equal(generic.translate('working').state, 'working');
  assert.equal(generic.translate('end').state, null);
  assert.equal(generic.translate('banana').state, undefined);
});

test('CLAUDE_CONFIG_DIR cambia dónde se conecta', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentling-'));
  const previous = process.env.CLAUDE_CONFIG_DIR;
  process.env.CLAUDE_CONFIG_DIR = dir;
  try {
    assert.equal(adapter.detect(), true);
    assert.equal(adapter.isConnected(), false);
    adapter.connect();
    assert.equal(adapter.isConnected(), true);
    assert.ok(fs.existsSync(path.join(dir, 'settings.json')));
    adapter.disconnect();
    assert.equal(adapter.isConnected(), false);
  } finally {
    if (previous === undefined) delete process.env.CLAUDE_CONFIG_DIR; else process.env.CLAUDE_CONFIG_DIR = previous;
  }
});
