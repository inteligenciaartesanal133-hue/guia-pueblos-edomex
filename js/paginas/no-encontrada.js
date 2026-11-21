// Pagina 404.
import { iniciarPagina } from "../layout.js";
import { noEncontrado } from "./comun.js";

const { t } = await iniciarPagina("");
document.title = `${t("noEncontrado")} · EdoMéx`;
document.getElementById("principal").innerHTML = noEncontrado(t, { url: "index.html", clave: "irInicio" });
