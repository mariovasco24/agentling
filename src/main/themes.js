'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ID = /^[a-z0-9-]+$/i;
const DEFAULT_THEME = 'spark';

/**
 * Un tema es una carpeta con theme.json, theme.html y theme.css.
 * Los temas del usuario (en la carpeta de datos) tienen prioridad sobre los incluidos.
 */
function listThemes(dirs) {
  const found = new Map();
  for (const dir of dirs) {
    let names = [];
    try { names = fs.readdirSync(dir); } catch { continue; }
    for (const id of names) {
      const themeDir = path.join(dir, id);
      if (!ID.test(id) || !fs.existsSync(path.join(themeDir, 'theme.html'))
        || !fs.existsSync(path.join(themeDir, 'theme.css'))) continue;
      let meta = {};
      try { meta = JSON.parse(fs.readFileSync(path.join(themeDir, 'theme.json'), 'utf8')); } catch { /* opcional */ }
      found.set(id, { id, name: meta.name || id, dir: themeDir });
    }
  }
  return [...found.values()];
}

/** Carga el HTML/CSS del tema. `{{base}}` en el HTML se sustituye por la URL de su carpeta (para imágenes propias). */
function loadTheme(themes, id) {
  const theme = themes.find((t) => t.id === id) || themes.find((t) => t.id === DEFAULT_THEME) || themes[0];
  if (!theme) return null;
  const base = pathToFileURL(theme.dir).href;
  return {
    id: theme.id,
    css: fs.readFileSync(path.join(theme.dir, 'theme.css'), 'utf8'),
    html: fs.readFileSync(path.join(theme.dir, 'theme.html'), 'utf8').replaceAll('{{base}}', base),
  };
}

module.exports = { listThemes, loadTheme, DEFAULT_THEME };
