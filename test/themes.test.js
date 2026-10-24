'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { listThemes, loadTheme } = require('../src/main/themes');

const builtin = path.join(__dirname, '..', 'themes');

test('los temas incluidos son válidos y cubren los cuatro estados', () => {
  const themes = listThemes([builtin]);
  assert.ok(themes.some((t) => t.id === 'spark'));
  assert.ok(themes.some((t) => t.id === 'traffic-light'));
  for (const { id } of themes) {
    const { css } = loadTheme(themes, id);
    for (const state of ['idle', 'thinking', 'working', 'attention']) {
      assert.match(css, new RegExp(`data-state="${state}"`), `${id} no define ${state}`);
    }
  }
});

test('un tema de usuario reemplaza al incluido con el mismo id y {{base}} se resuelve', () => {
  const user = fs.mkdtempSync(path.join(os.tmpdir(), 'agentling-'));
  fs.mkdirSync(path.join(user, 'spark'));
  fs.writeFileSync(path.join(user, 'spark', 'theme.html'), '<img src="{{base}}/a.png">');
  fs.writeFileSync(path.join(user, 'spark', 'theme.css'), '/* mi tema */');
  const themes = listThemes([builtin, user]);
  const theme = loadTheme(themes, 'spark');
  assert.match(theme.html, /^<img src="file:\/\/.*\/spark\/a\.png">$/);
});

test('un id desconocido cae al tema por defecto', () => {
  const themes = listThemes([builtin]);
  assert.equal(loadTheme(themes, 'no-existe').id, 'spark');
});

test('carpetas sin theme.html/theme.css o con nombre raro se ignoran', () => {
  const user = fs.mkdtempSync(path.join(os.tmpdir(), 'agentling-'));
  fs.mkdirSync(path.join(user, 'incompleto'));
  fs.mkdirSync(path.join(user, 'raro name'));
  assert.deepEqual(listThemes([user]), []);
});
