import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Open Graph card in brand colors: charcoal background, ivory Fraunces headline,
 * brass hairline and loop. No photos. Fonts are bundled in /assets/fonts (OFL).
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "assets/fonts");

/** Font files never change, so the read is cached and the images prerender at build. */
async function loadFonts() {
  "use cache";
  const [fraunces, inter] = await Promise.all([
    readFile(join(fontDir, "fraunces-latin-500-normal.woff")),
    readFile(join(fontDir, "inter-latin-500-normal.woff")),
  ]);
  return { fraunces: new Uint8Array(fraunces), inter: new Uint8Array(inter) };
}

/** Copy a view into its own ArrayBuffer (a cached view can sit inside a larger buffer). */
function exact(view: Uint8Array): ArrayBuffer {
  return view.slice().buffer as ArrayBuffer;
}

export async function renderOg({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { fraunces, inter } = await loadFonts();
  const titleSize = title.length > 70 ? 56 : title.length > 45 ? 66 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1B1F23",
          padding: "72px 80px",
          color: "#F8F5EF",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="60" height="36" viewBox="0 0 40 24" fill="none">
            <path
              d="M20 11C16.5 4.5 6 4.5 6 11s10.5 6.5 14 0 14-6.5 14 0-10.5 6.5-14 0Z"
              stroke="#B8894A"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M9.2 15.9 6.6 21l5.7-3.3" stroke="#B8894A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontFamily: "Fraunces", fontSize: 38 }}>ReplyLoop</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
            <div style={{ width: 56, height: 2, background: "#B8894A" }} />
            <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#C9C4BA" }}>{eyebrow}</div>
          </div>
          <div style={{ fontFamily: "Fraunces", fontSize: titleSize, lineHeight: 1.08, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#C9C4BA" }}>
          <div>Keep the thank you alive.</div>
          <div>reply-loop.com</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Fraunces", data: exact(fraunces), style: "normal", weight: 500 },
        { name: "Inter", data: exact(inter), style: "normal", weight: 500 },
      ],
    },
  );
}
