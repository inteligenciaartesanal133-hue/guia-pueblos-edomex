// Recorta el papel rasgado de una imagen (quita el paisaje de alrededor).
// Desde las orillas se rellena todo lo que NO tiene color de papel; lo que queda
// encerrado por el papel (letras, corazon) se conserva.
// Uso: node scripts/recortar-papel.mjs entrada.jpg salida.png
import { readFileSync, writeFileSync } from "node:fs";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const [entrada, salida] = process.argv.slice(2);
const { width: W, height: H, data } = jpeg.decode(readFileSync(entrada), { useTArray: true });

// Papel: claro, calido y poco saturado.
function esPapel(p) {
  const i = p * 4, r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return r > 195 && g > 175 && b > 140 && max - min < 75 && r >= b;
}

const fuera = new Uint8Array(W * H);
const pila = [];
for (let x = 0; x < W; x++) pila.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) pila.push(y * W, y * W + W - 1);
while (pila.length) {
  const p = pila.pop();
  if (fuera[p] || esPapel(p)) continue;
  fuera[p] = 1;
  const x = p % W, y = (p / W) | 0;
  if (x > 0) pila.push(p - 1);
  if (x < W - 1) pila.push(p + 1);
  if (y > 0) pila.push(p - W);
  if (y < H - 1) pila.push(p + W);
}

// Quitamos islas pequenas de "papel" sueltas en el fondo: nos quedamos con la region
// conectada mas grande que no es fondo.
const region = new Int32Array(W * H).fill(-1);
let mejor = -1, mejorTam = 0, id = 0;
for (let s = 0; s < W * H; s++) {
  if (fuera[s] || region[s] !== -1) continue;
  let tam = 0; const q = [s]; region[s] = id;
  while (q.length) {
    const p = q.pop(); tam++;
    const x = p % W, y = (p / W) | 0;
    for (const v of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1]) {
      if (v >= 0 && !fuera[v] && region[v] === -1) { region[v] = id; q.push(v); }
    }
  }
  if (tam > mejorTam) { mejorTam = tam; mejor = id; }
  id++;
}

let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let p = 0; p < W * H; p++) if (region[p] === mejor) {
  const x = p % W, y = (p / W) | 0;
  if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
}
const png = new PNG({ width: x1 - x0 + 1, height: y1 - y0 + 1 });
for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
  const p = y * W + x, i = p * 4, o = ((y - y0) * png.width + (x - x0)) * 4;
  png.data[o] = data[i]; png.data[o + 1] = data[i + 1]; png.data[o + 2] = data[i + 2];
  png.data[o + 3] = region[p] === mejor ? 255 : 0;
}
writeFileSync(salida, PNG.sync.write(png));
console.log(`listo: ${salida} (${png.width}x${png.height})`);
