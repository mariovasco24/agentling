#!/usr/bin/env node
'use strict';

/**
 * En algunos equipos la descompresión automática de Electron queda a medias
 * (falta path.txt o los frameworks). Si el zip descargado está en caché, se
 * vuelve a extraer con las herramientas del sistema.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const dir = path.join(__dirname, '..', 'node_modules', 'electron');
const dist = path.join(dir, 'dist');
const pathFile = path.join(dir, 'path.txt');

function healthy() {
  if (!fs.existsSync(pathFile)) return false;
  const exe = path.join(dist, fs.readFileSync(pathFile, 'utf8'));
  if (!fs.existsSync(exe)) return false;
  return process.platform !== 'darwin' || fs.existsSync(path.join(dist, 'Electron.app', 'Contents', 'Frameworks'));
}

/** Busca en la caché de descargas de Electron el zip de LA versión instalada (no uno cualquiera). */
function cachedZip() {
  const { version } = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const name = `electron-v${version}-${process.platform}-${process.arch}.zip`;
  const roots = [
    path.join(os.homedir(), 'Library', 'Caches', 'electron'),
    path.join(process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache'), 'electron'),
    path.join(process.env.LOCALAPPDATA || '', 'electron', 'Cache'),
  ];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const candidate of [root, ...fs.readdirSync(root).map((sub) => path.join(root, sub))]) {
      const file = path.join(candidate, name);
      if (fs.existsSync(file)) return file;
    }
  }
  return null;
}

if (!fs.existsSync(dir)) {
  console.error('agentling: electron is not installed. Run "npm install" first.');
  process.exit(1);
}
if (healthy()) process.exit(0);

const zip = cachedZip();
if (!zip || process.platform === 'win32') {
  console.error('agentling: the Electron download looks incomplete. Delete node_modules and run "npm install" again.');
  process.exit(1);
}
console.log('agentling: repairing the Electron install…');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);
execFileSync('unzip', ['-q', zip, '-d', dist]);
const exe = { darwin: 'Electron.app/Contents/MacOS/Electron', linux: 'electron' }[process.platform];
fs.writeFileSync(pathFile, exe);
console.log('agentling: Electron repaired.');
