'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { aggregate } = require('../src/main/state');

const NOW = 1_000_000;
const fresh = (state) => ({ state, mtimeMs: NOW - 1000 });

test('sin sesiones está idle', () => {
  assert.equal(aggregate([], NOW), 'idle');
});

test('gana el estado de mayor prioridad entre varias sesiones', () => {
  assert.equal(aggregate([fresh('idle'), fresh('thinking')], NOW), 'thinking');
  assert.equal(aggregate([fresh('thinking'), fresh('working')], NOW), 'working');
  assert.equal(aggregate([fresh('working'), fresh('attention'), fresh('idle')], NOW), 'attention');
});

test('thinking y working caducan si no hay señales (p. ej. Esc)', () => {
  const old = { state: 'working', mtimeMs: NOW - 6 * 60 * 1000 };
  assert.equal(aggregate([old], NOW), 'idle');
  assert.equal(aggregate([{ ...old, state: 'thinking' }], NOW), 'idle');
});

test('attention no caduca: sigue pidiendo tu atención', () => {
  assert.equal(aggregate([{ state: 'attention', mtimeMs: NOW - 60 * 60 * 1000 }], NOW), 'attention');
});

test('contenido desconocido se trata como idle', () => {
  assert.equal(aggregate([fresh('banana'), fresh('__proto__')], NOW), 'idle');
});
