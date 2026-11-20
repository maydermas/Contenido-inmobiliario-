// Identidad visual oficial (Directiva 2.0, §3). Único sitio donde se definen colores,
// tipografías y ritmos: cambiar aquí cambia todos los vídeos.
// Fuentes incluidas en el proyecto (Fontsource, licencia SIL OFL): el render no depende de internet.
import "@fontsource-variable/manrope/index.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import { continueRender, delayRender } from "remotion";

export const MARCA = {
  nombre: "Lo Estudiamos", // provisional hasta elegir nombre definitivo
  lema: "No pienso ofrecerte nada de lo que sepa que en un futuro te puedas arrepentir.",
  firma: "Lo estudiamos juntos",
};

export const C = {
  verde: "#142B25",
  verdeMedio: "#1D3A32",
  verdeClaro: "#2C4A42",
  beige: "#E8DDC9",
  blanco: "#F7F5EF",
  bronce: "#B18A58",
  bronceClaro: "#D2AE7C", // bronce para texto sobre verde (contraste ≥ 4.5:1)
  bronceOscuro: "#76583A", // bronce para texto sobre beige/blanco (contraste 4,8:1 y 6:1)
  gris: "#262B29",
  luz: "#F3D9A4", // luz cálida de ventanas y sol (uso ilustrativo, no tipográfico)
};

export const F = {
  sans: "'Manrope Variable', Manrope, sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
};

// Esperar a que las fuentes estén cargadas antes de renderizar cualquier fotograma
if (typeof document !== "undefined") {
  const h = delayRender("Cargando fuentes de marca");
  Promise.all(
    ["400", "500", "700", "800"].map((w) => document.fonts.load(`${w} 40px 'Manrope Variable'`, "Aá€ñ")).concat(
      ["500", "600"].flatMap((w) => [
        document.fonts.load(`${w} 40px 'Cormorant Garamond'`, "Aá€ñ"),
        document.fonts.load(`italic ${w} 40px 'Cormorant Garamond'`, "Aá€ñ"),
      ]),
    ),
  )
    .then(() => continueRender(h))
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
}

export const VIDEO = {
  fps: 30,
  ancho: 1080,
  alto: 1920,
  transicion: 12, // frames de fundido entre escenas
  adelanto: 5, // la imagen entra unos frames antes que la voz
  cola: 2.4, // segundos tras la última palabra (firma de marca)
};

// Zonas seguras para Reels / TikTok / Shorts (la interfaz tapa abajo y a la derecha)
export const ZONA = {
  arriba: 170,
  visualFin: 1140,
  subtitulos: 1250,
  abajo: 1500,
  lateral: 80,
};
