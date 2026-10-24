'use strict';

const fs = require('fs');
const path = require('path');

/** Cualquier hook cuyo comando contenga esto lo gestiona Agentling (permite reinstalar y desinstalar sin tocar otros). */
const MARKER = 'agentling-hook.js';
const HOOK_PATH = path.join(__dirname, '..', '..', '..', 'bin', MARKER);

/** [evento de Claude Code, matcher opcional, argumento para el hook] */
const EVENTS = [
  ['UserPromptSubmit', null, 'prompt'],
  ['PreToolUse', null, 'pre-tool'],
  ['PostToolUse', null, 'post-tool'],
  ['Notification', 'permission_prompt|elicitation_dialog', 'attention'],
  ['Stop', null, 'stop'],
  ['SessionEnd', null, 'end'],
];

const isOurs = (hook) => typeof hook?.command === 'string' && hook.command.includes(MARKER);

/** Devuelve una copia de los ajustes sin ningún hook de Agentling. */
function removeHooks(settings) {
  const next = structuredClone(settings);
  if (!next.hooks) return next;
  for (const [event, groups] of Object.entries(next.hooks)) {
    const kept = groups
      .map((group) => ({ ...group, hooks: (group.hooks || []).filter((h) => !isOurs(h)) }))
      .filter((group) => group.hooks.length > 0);
    if (kept.length) next.hooks[event] = kept;
    else delete next.hooks[event];
  }
  if (Object.keys(next.hooks).length === 0) delete next.hooks;
  return next;
}

/** Devuelve una copia de los ajustes con los hooks de Agentling (idempotente: reinstalar no duplica). */
function addHooks(settings, { nodePath = process.execPath, hookPath = HOOK_PATH } = {}) {
  const next = removeHooks(settings);
  next.hooks = next.hooks || {};
  for (const [event, matcher, arg] of EVENTS) {
    const group = { hooks: [{ type: 'command', command: `"${nodePath}" "${hookPath}" claude-code ${arg}` }] };
    if (matcher) group.matcher = matcher;
    (next.hooks[event] = next.hooks[event] || []).push(group);
  }
  return next;
}

const hasHooks = (settings) => Object.values(settings.hooks || {})
  .some((groups) => groups.some((group) => (group.hooks || []).some(isOurs)));

function readSettings(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8')); // si el JSON es inválido lanza: no se toca el archivo
}

function writeAtomic(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

function installHooks(file) {
  const settings = readSettings(file);
  const backup = `${file}.bak-agentling`;
  if (fs.existsSync(file) && !fs.existsSync(backup)) fs.copyFileSync(file, backup);
  writeAtomic(file, addHooks(settings));
}

function uninstallHooks(file) {
  if (fs.existsSync(file)) writeAtomic(file, removeHooks(readSettings(file)));
}

function hooksInstalled(file) {
  try { return hasHooks(readSettings(file)); } catch { return false; }
}

module.exports = { MARKER, HOOK_PATH, EVENTS, addHooks, removeHooks, hasHooks, installHooks, uninstallHooks, hooksInstalled };
