import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { LOOP_CROSSING_PATH, LOOP_PATH, LOOP_STROKE, LOOP_VIEWBOX } from "./loop/geometry.generated";

/**
 * Open Graph card in brand colors: charcoal background, ivory Fraunces headline,
 * brass hairline and loop. No photos. Fonts are bundled in /assets/fonts (OFL).
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Copy a view into its own ArrayBuffer (a cached view can sit inside a larger buffer). */
function exact(view: Uint8Array): ArrayBuffer {
  return view.slice().buffer as ArrayBuffer;
}

export async function renderOg({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { fraunces, inter } = await loadOgFonts();
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
          <svg width="74" height="34" viewBox={LOOP_VIEWBOX} fill="none">
            <path d={LOOP_PATH} stroke="#8A5F1C" strokeWidth={LOOP_STROKE} strokeLinejoin="round" />
            <path d={LOOP_CROSSING_PATH} stroke="#F8F5EF" strokeWidth={LOOP_STROKE + 0.4} />
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
