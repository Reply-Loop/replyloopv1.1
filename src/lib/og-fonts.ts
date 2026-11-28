import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontDir = join(process.cwd(), "assets/fonts");

/** Font files never change, so the read is cached and the images prerender at build. */
export async function loadOgFonts() {
  "use cache";
  const [fraunces, inter] = await Promise.all([
    readFile(join(fontDir, "fraunces-latin-500-normal.woff")),
    readFile(join(fontDir, "inter-latin-500-normal.woff")),
  ]);
  return { fraunces: new Uint8Array(fraunces), inter: new Uint8Array(inter) };
}
