'use strict';

const STRINGS = {
  en: {
    idle: 'Idle', thinking: 'Thinking…', working: 'Working', attention: 'Needs you!',
    toggle: 'Show / hide', size: 'Size', small: 'Small', medium: 'Medium', large: 'Large',
    theme: 'Theme', sound: 'Sound when it needs you', login: 'Start at login',
    themesFolder: 'Open themes folder', connect: '⚠ Connect {agent}', quit: 'Quit',
  },
  es: {
    idle: 'Libre', thinking: 'Pensando…', working: 'Trabajando', attention: '¡Te necesito!',
    toggle: 'Mostrar / ocultar', size: 'Tamaño', small: 'Pequeño', medium: 'Mediano', large: 'Grande',
    theme: 'Tema', sound: 'Sonido al necesitarte', login: 'Iniciar con la sesión',
    themesFolder: 'Abrir carpeta de temas', connect: '⚠ Conectar {agent}', quit: 'Salir',
  },
};

/** Elige el idioma a partir de un locale ("es-MX" → "es"); por defecto inglés. */
function pickLanguage(locale = '') {
  const lang = String(locale).slice(0, 2).toLowerCase();
  return STRINGS[lang] ? lang : 'en';
}

const strings = (lang) => STRINGS[pickLanguage(lang)];

module.exports = { pickLanguage, strings };
