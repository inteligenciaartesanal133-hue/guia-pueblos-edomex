// Quita el fondo blanco de una imagen JPG del ajolote y la guarda como PNG transparente.
// Rellena desde las orillas solo los pixeles casi blancos, asi que lo blanco encerrado
// por el contorno (como la blusa) se conserva.
// Uso: node scripts/quitar-fondo.mjs entrada.jpg salida.png
// Requiere: npm install jpeg-js pngjs --no-save
import { readFileSync, writeFileSync } from "node:fs";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

const [entrada, salida] = process.argv.slice(2);
const img = jpeg.decode(readFileSync(entrada), { useTArray: true });
const { width: W, height: H, data } = img;

const brillo = (i) => Math.min(data[i], data[i + 1], data[i + 2]);
const esFondo = (p) => brillo(p * 4) >= 225; // casi blanco (tolera ruido del JPG)

// Relleno por inundacion desde todos los bordes.
const fondo = new Uint8Array(W * H);
const pila = [];
for (let x = 0; x < W; x++) pila.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) pila.push(y * W, y * W + W - 1);
while (pila.length) {
  const p = pila.pop();
  if (fondo[p] || !esFondo(p)) continue;
  fondo[p] = 1;
  const x = p % W, y = (p / W) | 0;
  if (x > 0) pila.push(p - 1);
  if (x < W - 1) pila.push(p + 1);
  if (y > 0) pila.push(p - W);
  if (y < H - 1) pila.push(p + W);
}

// Recorta al tamano del dibujo y suaviza el borde (pixeles junto al fondo, semitransparentes).
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let p = 0; p < W * H; p++) if (!fondo[p]) {
  const x = p % W, y = (p / W) | 0;
  if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
}
const m = 4;
x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(W - 1, x1 + m); y1 = Math.min(H - 1, y1 + m);
const png = new PNG({ width: x1 - x0 + 1, height: y1 - y0 + 1 });
for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
  const p = y * W + x, i = p * 4, o = ((y - y0) * png.width + (x - x0)) * 4;
  png.data[o] = data[i]; png.data[o + 1] = data[i + 1]; png.data[o + 2] = data[i + 2];
  let a = 255;
  if (fondo[p]) a = 0;
  else {
    // borde: si toca fondo, alfa segun que tan claro es el pixel
    const vecino = (x > 0 && fondo[p - 1]) || (x < W - 1 && fondo[p + 1]) || (y > 0 && fondo[p - W]) || (y < H - 1 && fondo[p + W]);
    if (vecino) a = Math.max(0, Math.min(255, Math.round((255 - brillo(i)) * 3)));
  }
  png.data[o + 3] = a;
}
writeFileSync(salida, PNG.sync.write(png));
console.log(`listo: ${salida} (${png.width}x${png.height})`);
