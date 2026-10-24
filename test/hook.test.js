'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { handle, safeId } = require('../bin/agentling-hook');

const HOOK = path.join(__dirname, '..', 'bin', 'agentling-hook.js');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agentling-'));

test('escribe y borra el archivo de la sesión, prefijado con el agente', () => {
  const dir = tmp();
  handle('claude-code', 'pre-tool', { session_id: 'abc', tool_name: 'Bash' }, dir);
  assert.equal(fs.readFileSync(path.join(dir, 'claude-code__abc'), 'utf8'), 'working');
  handle('claude-code', 'end', { session_id: 'abc' }, dir);
  assert.deepEqual(fs.readdirSync(dir), []);
});

test('sesiones de agentes distintos con el mismo id no se pisan', () => {
  const dir = tmp();
  handle('claude-code', 'prompt', { session_id: 'x' }, dir);
  handle('generic', 'attention', { session_id: 'x' }, dir);
  assert.deepEqual(fs.readdirSync(dir).sort(), ['claude-code__x', 'generic__x']);
});

test('adaptador o evento desconocido se ignora', () => {
  const dir = tmp();
  handle('no-existe', 'prompt', {}, dir);
  handle('claude-code', 'nope', { session_id: 'a' }, dir);
  assert.deepEqual(fs.existsSync(dir) ? fs.readdirSync(dir) : [], []);
});

test('el id de sesión no puede salirse de la carpeta de estados', () => {
  assert.equal(safeId('../../etc/passwd'), '______etc_passwd');
  const dir = tmp();
  handle('claude-code', 'prompt', { session_id: '../escape' }, dir);
  assert.deepEqual(fs.readdirSync(dir), ['claude-code__' + '___escape']);
});

test('elimina sesiones abandonadas hace más de 2 horas', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'old'), 'working');
  const longAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  fs.utimesSync(path.join(dir, 'old'), longAgo, longAgo);
  handle('claude-code', 'prompt', { session_id: 'new' }, dir);
  assert.deepEqual(fs.readdirSync(dir), ['claude-code__new']);
});

test('como proceso: lee JSON por stdin, usa AGENTLING_STATE_DIR y sale con 0', () => {
  const dir = tmp();
  const result = spawnSync(process.execPath, [HOOK, 'claude-code', 'prompt'], {
    input: JSON.stringify({ session_id: 's1' }), env: { ...process.env, AGENTLING_STATE_DIR: dir },
  });
  assert.equal(result.status, 0);
  assert.equal(fs.readFileSync(path.join(dir, 'claude-code__s1'), 'utf8'), 'thinking');
});

test('adaptador genérico desde la línea de comandos', () => {
  const dir = tmp();
  const run = (event, input = '') => spawnSync(process.execPath, [HOOK, 'generic', event], {
    input, env: { ...process.env, AGENTLING_STATE_DIR: dir },
  });
  assert.equal(run('working').status, 0);
  assert.equal(fs.readFileSync(path.join(dir, 'generic__default'), 'utf8'), 'working');
  run('attention', JSON.stringify({ session_id: 'build-42' }));
  assert.equal(fs.readFileSync(path.join(dir, 'generic__build-42'), 'utf8'), 'attention');
  run('end');
  assert.equal(fs.existsSync(path.join(dir, 'generic__default')), false);
});

test('con stdin inválido no falla', () => {
  const dir = tmp();
  const result = spawnSync(process.execPath, [HOOK, 'claude-code', 'stop'], {
    input: 'no es json', env: { ...process.env, AGENTLING_STATE_DIR: dir },
  });
  assert.equal(result.status, 0);
});
