import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontDir = join(process.cwd(), "assets/fonts");

/**
 * The static-export twin of og-fonts.ts (next.config.ts aliases it in when
 * STATIC_EXPORT=1). Static export cannot run with Cache Components, so there
 * is no "use cache" here; every OG image is rendered once at build anyway.
 */
export async function loadOgFonts() {
  const [fraunces, inter] = await Promise.all([
    readFile(join(fontDir, "fraunces-latin-500-normal.woff")),
    readFile(join(fontDir, "inter-latin-500-normal.woff")),
  ]);
  return { fraunces: new Uint8Array(fraunces), inter: new Uint8Array(inter) };
}
