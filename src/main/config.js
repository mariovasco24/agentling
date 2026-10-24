'use strict';

const fs = require('fs');
const path = require('path');

const SIZES = Object.freeze({ small: 0.7, medium: 1, large: 1.4 });

const DEFAULTS = Object.freeze({ x: null, y: null, scale: 1, sound: true, theme: 'spark', language: null });

/** Descarta valores con tipo incorrecto para que un archivo editado a mano no rompa la app. */
function sanitize(raw) {
  const out = { ...DEFAULTS };
  if (!raw || typeof raw !== 'object') return out;
  if (Number.isFinite(raw.x) && Number.isFinite(raw.y)) { out.x = Math.round(raw.x); out.y = Math.round(raw.y); }
  if (Object.values(SIZES).includes(raw.scale)) out.scale = raw.scale;
  if (typeof raw.sound === 'boolean') out.sound = raw.sound;
  if (typeof raw.theme === 'string' && /^[a-z0-9-]+$/i.test(raw.theme)) out.theme = raw.theme;
  if (typeof raw.language === 'string') out.language = raw.language;
  return out;
}

function createConfigStore(file) {
  let data = { ...DEFAULTS };
  try { data = sanitize(JSON.parse(fs.readFileSync(file, 'utf8'))); } catch { /* primera ejecución o archivo dañado */ }

  return {
    get: () => data,
    set(patch) {
      data = sanitize({ ...data, ...patch });
      try {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
      } catch { /* si no se puede guardar, la app sigue funcionando */ }
      return data;
    },
  };
}

module.exports = { createConfigStore, sanitize, SIZES, DEFAULTS };
