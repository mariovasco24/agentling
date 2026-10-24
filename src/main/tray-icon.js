'use strict';

const zlib = require('zlib');
const { nativeImage } = require('electron');

const COLORS = { idle: [52, 199, 89], thinking: [255, 204, 0], working: [10, 132, 255], attention: [255, 59, 48] };
const SIZE = 32; // se muestra a 16 pt en pantallas retina

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** PNG RGBA de un círculo de color con borde suavizado; sin dependencias ni archivos de imagen. */
function circlePng([r, g, b]) {
  const rows = [];
  const c = (SIZE - 1) / 2;
  for (let y = 0; y < SIZE; y++) {
    const row = Buffer.alloc(1 + SIZE * 4);
    for (let x = 0; x < SIZE; x++) {
      const dist = Math.hypot(x - c, y - c);
      const alpha = Math.max(0, Math.min(1, SIZE / 2 - 3 - dist + 0.5));
      row.set([r, g, b, Math.round(alpha * 255)], 1 + x * 4);
    }
    rows.push(row);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(SIZE, 0); header.writeUInt32BE(SIZE, 4);
  header.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const cache = {};
function trayIcon(state) {
  if (!cache[state]) {
    cache[state] = nativeImage.createFromBuffer(circlePng(COLORS[state] || COLORS.idle), { scaleFactor: 2 });
  }
  return cache[state];
}

module.exports = { trayIcon };
