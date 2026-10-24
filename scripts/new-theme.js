#!/usr/bin/env node
'use strict';

/** Uso: npm run theme:new -- <id> [--dir <carpeta>]   Crea un tema nuevo listo para editar (por defecto en ./themes). */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dirIdx = args.indexOf('--dir');
const base = dirIdx >= 0 ? args[dirIdx + 1] : path.join(__dirname, '..', 'themes');
const id = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--dir');

if (!id || !/^[a-z0-9-]+$/i.test(id)) {
  console.error('Usage: npm run theme:new -- <theme-id> [--dir <folder>]   (id: letters, digits and dashes)');
  process.exit(1);
}
const dir = path.join(base, id);
if (fs.existsSync(dir)) {
  console.error(`agentling: ${dir} already exists`);
  process.exit(1);
}
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'theme.json'), JSON.stringify({ apiVersion: 1, name: id, description: '', author: '' }, null, 2) + '\n');
fs.writeFileSync(path.join(dir, 'theme.html'), '<div class="dot"></div>\n');
fs.writeFileSync(path.join(dir, 'theme.css'), `/* Tema "${id}". El estado actual llega en el host: :host([data-state="idle|thinking|working|attention"]). */
.dot { width: 80px; height: 80px; margin: 40px; border-radius: 50%; background: var(--state-color); transition: background .3s; }

:host([data-state="idle"])      .dot { animation: breathe 4s ease-in-out infinite; }
:host([data-state="thinking"])  .dot { animation: breathe 1.6s ease-in-out infinite; }
:host([data-state="working"])   .dot { animation: spin .8s linear infinite; border-radius: 30%; }
:host([data-state="attention"]) .dot { animation: jump .6s ease-in-out infinite; }

@keyframes breathe { 50% { transform: scale(1.1); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes jump { 50% { transform: translateY(-14px); } }
`);
console.log(`agentling: theme created in ${dir}\nEdit its files, then pick it from the pet\'s menu (Theme).`);
