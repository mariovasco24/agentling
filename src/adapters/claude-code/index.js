'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { STATES } = require('../../shared/states');
const settings = require('./settings');

const configDir = () => process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const settingsFile = () => path.join(configDir(), 'settings.json');

module.exports = {
  id: 'claude-code',
  name: 'Claude Code',

  /** Traduce un evento de hook de Claude Code. Claude Code no tiene evento "pensando": se deduce entre prompt y herramientas. */
  translate(event, payload = {}) {
    const session = payload.session_id || 'unknown';
    switch (event) {
      case 'prompt': return { session, state: STATES.THINKING };
      case 'pre-tool': return { session, state: payload.tool_name === 'AskUserQuestion' ? STATES.ATTENTION : STATES.WORKING };
      case 'post-tool': return { session, state: STATES.THINKING };
      case 'attention': return { session, state: STATES.ATTENTION };
      case 'stop': return { session, state: STATES.IDLE };
      case 'end': return { session, state: null };
      default: return { session, state: undefined };
    }
  },

  detect: () => fs.existsSync(configDir()),
  isConnected: () => settings.hooksInstalled(settingsFile()),
  connect: () => settings.installHooks(settingsFile()),
  disconnect: () => settings.uninstallHooks(settingsFile()),
  location: settingsFile,
};
