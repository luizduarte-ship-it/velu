// Identidade visual da VELU. Use sempre estes tokens nos videos.
// Regra da marca: nunca texto cinza, so navy ou azul.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes embutidas em public/fonts (renderiza offline, sem depender do Google).
const font = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, format: "woff2" });

font("Instrument Sans", "instrument-sans-latin-400-normal.woff2", "400");
font("Instrument Sans", "instrument-sans-latin-700-normal.woff2", "700");
font("IBM Plex Mono", "ibm-plex-mono-latin-500-normal.woff2", "500");

export const fonts = {
  title: "Instrument Sans", // Instrument Sans Bold (700)
  body: "Instrument Sans", // Instrument Sans Regular (400)
  kicker: "IBM Plex Mono", // IBM Plex Mono, maiusculo, em azul
};

export const colors = {
  navy: "#06142C",
  navy2: "#0B2145",
  navy3: "#243b63",
  blue: "#116CFE",
  blue2: "#3E8BFF",
  darkBg: "#040A18",
};

export const backgrounds = {
  light: "linear-gradient(180deg, #FFFFFF 0%, #F1F6FF 55%, #E4EDFB 100%)",
  dark: "linear-gradient(180deg, #0B2145 0%, #040A18 100%)",
};

export const tagline = {
  part1: "Você pensa.",
  part2: "A Velu faz acontecer.",
};
