'use strict';

const { Menu } = require('electron');
const { SIZES } = require('./config');

/** Construye el menú contextual (clic derecho sobre la mascota o icono de la barra de menú). */
function buildMenu({ t, config, themes, pendingAgents, actions, canAutostart, autostart }) {
  const items = [];
  for (const agent of pendingAgents) {
    items.push({ label: t.connect.replace('{agent}', agent.name), click: () => actions.connect(agent) });
  }
  if (pendingAgents.length) items.push({ type: 'separator' });
  items.push(
    { label: t.toggle, click: actions.toggle },
    {
      label: t.size,
      submenu: Object.entries(SIZES).map(([key, scale]) => ({
        label: t[key], type: 'radio', checked: config.scale === scale, click: () => actions.setScale(scale),
      })),
    },
    {
      label: t.theme,
      submenu: themes.map((theme) => ({
        label: theme.name, type: 'radio', checked: config.theme === theme.id, click: () => actions.setTheme(theme.id),
      })),
    },
    { label: t.sound, type: 'checkbox', checked: config.sound, click: (item) => actions.setSound(item.checked) },
  );
  if (canAutostart) {
    items.push({ label: t.login, type: 'checkbox', checked: autostart, click: (item) => actions.setAutostart(item.checked) });
  }
  items.push(
    { label: t.themesFolder, click: actions.openThemes },
    { type: 'separator' },
    { label: t.quit, click: actions.quit },
  );
  return Menu.buildFromTemplate(items);
}

module.exports = { buildMenu };
