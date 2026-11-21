// Descarga las fotos de data/fotos.json desde Wikimedia Commons (1280 px de ancho).
// Uso: node scripts/bajar-fotos.mjs   (salta las que ya existen)
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const fotos = JSON.parse(readFileSync("data/fotos.json", "utf8"));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [clave, f] of Object.entries(fotos)) {
  if (existsSync(f.archivo)) continue;
  const nombre = f.archivo_commons.replace(/^File:/, "");
  const url = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(nombre)}&width=1280`;
  const resp = await fetch(url, { headers: { "User-Agent": "guia-turistica-escolar/1.0" } });
  const tipo = resp.headers.get("content-type") || "";
  if (!resp.ok || !tipo.startsWith("image/")) { console.log("FALLO", clave, resp.status, tipo); continue; }
  writeFileSync(f.archivo, Buffer.from(await resp.arrayBuffer()));
  console.log("ok", clave, tipo);
  await espera(800);
}
