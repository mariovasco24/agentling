'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createConfigStore, sanitize, DEFAULTS } = require('../src/main/config');
const { pickLanguage } = require('../src/shared/i18n');

const file = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'agentling-')), 'config.json');

test('sin archivo usa los valores por defecto', () => {
  assert.deepEqual(createConfigStore(file()).get(), DEFAULTS);
});

test('guarda y recupera cambios', () => {
  const f = file();
  createConfigStore(f).set({ theme: 'traffic-light', sound: false, x: 10, y: 20 });
  const loaded = createConfigStore(f).get();
  assert.equal(loaded.theme, 'traffic-light');
  assert.equal(loaded.sound, false);
  assert.deepEqual([loaded.x, loaded.y], [10, 20]);
});

test('descarta valores inválidos o peligrosos', () => {
  const clean = sanitize({ scale: 99, theme: '../../etc', sound: 'yes', x: 'a', y: 1 });
  assert.deepEqual(clean, DEFAULTS);
});

test('un archivo corrupto no rompe la app', () => {
  const f = file();
  fs.writeFileSync(f, '{{{');
  assert.deepEqual(createConfigStore(f).get(), DEFAULTS);
});

test('el idioma se elige por locale y por defecto es inglés', () => {
  assert.equal(pickLanguage('es-MX'), 'es');
  assert.equal(pickLanguage('fr-FR'), 'en');
  assert.equal(pickLanguage(undefined), 'en');
});
