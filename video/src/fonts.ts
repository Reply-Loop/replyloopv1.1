import { continueRender, delayRender, staticFile } from "remotion";

const faces: Array<[string, string, string]> = [
  ["Fraunces", "fonts/Fraunces.woff2", "normal"],
  ["Fraunces", "fonts/Fraunces-Italic.woff2", "italic"],
  ["Inter", "fonts/Inter.woff2", "normal"],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Loading brand fonts");
  Promise.all(
    faces.map(([family, file, style]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, {
        style,
        weight: "100 900",
      });
      return face.load().then((f) => (document.fonts as unknown as { add: (f: FontFace) => void }).add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
