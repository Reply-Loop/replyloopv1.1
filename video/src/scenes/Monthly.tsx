import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ClipCard } from "../components/ClipCard";
import { PlatformTiles, PublishVisual, RevisionVisual, WorkbookVisual } from "../components/visuals";
import { ReviewCard } from "../components/ui";
import { clamp, theme } from "../theme";
import { PriceStack } from "./PriceStack";

// 16 real ReplyLoop creatives from the Drive folder = "16 concepts a month".
const WALL: Array<[string, number]> = [
  ["liquid09-review-follow.mp4", 1.2], ["photo10-homecare.mp4", 1.2], ["anim-services.mp4", 1.2], ["liquid13-website.mp4", 1.2],
  ["fieldnotes01-review-reply.mp4", 1.2], ["photo14-ownerknowledge.mp4", 1.2], ["ad2-reviews.mp4", 1.2], ["liquid16-thankyou.mp4", 1.2],
  ["photo15-ownercontrol.mp4", 1.2], ["anim-localseo.mp4", 1.2], ["fieldnotes02-one-take.mp4", 1.2], ["liquid15-ownercontrol.mp4", 1.2],
  ["ad3-testimonials.mp4", 1.2], ["fieldnotes03-mobile-test.mp4", 1.2], ["anim-webdesign.mp4", 1.2], ["fieldnotes04-private-detail.mp4", 1.2],
];

const Wall: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [at, at + 26], [0, 16], clamp));
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 212px)", gap: 14 }}>
        {WALL.map(([src, s], i) => (
          <ClipCard key={src} tile src={src} startSec={s} width={212} aspect={1.12} radius={18} delay={at + i * 1.6} zoom={[1.15, 1.25]} focusY={30} />
        ))}
      </div>
      <div style={{ position: "absolute", right: -10, top: -40, padding: "14px 26px", borderRadius: 999, background: theme.colors.brass, color: theme.colors.ink, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 34, fontVariantNumeric: "tabular-nums", boxShadow: `0 0 50px ${theme.colors.brassGlow}` }}>
        {n} / 16 this month
      </div>
    </div>
  );
};

export const Monthly: React.FC = () => (
  <PriceStack
    sectionId="05-monthly-350"
    index="03"
    eyebrow="Every month · per location"
    amount={350}
    unit="/ month"
    unitSub="Per location · month-to-month"
    items={[
      { title: "16 new creative concepts", visual: (at) => <Wall at={at} />, visualTop: 1060 },
      { title: "Made for Google, Facebook & Instagram", visual: (at) => <PlatformTiles at={at} /> },
      {
        title: "Unlimited Google review responses",
        visual: (at) => (
          <ReplyFlow at={at} />
        ),
      },
      { title: "Monthly organic growth workbook", visual: (at) => <WorkbookVisual at={at} /> },
      { title: "Two revision rounds per batch", visual: (at) => <RevisionVisual at={at} /> },
      { title: "We publish it, or you do. Same price.", visual: (at) => <PublishVisual at={at} /> },
    ]}
    recap={
      <div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 58, fontWeight: 600, color: theme.colors.ivory, letterSpacing: "-0.02em", lineHeight: 1.08 }}>
          $350/month per location.
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 29, color: theme.colors.ivoryDim, marginTop: 14, lineHeight: 1.4 }}>
          Billed monthly. Month-to-month: cancel anytime before your next billing date.
        </div>
      </div>
    }
  />
);

const ReplyFlow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [at + 4, at + 34], [0, 1], clamp);
  return (
    <div style={{ position: "relative" }}>
      <ReviewCard width={912} name="Chris L." text="Great communication from start to finish." replied={r} reply="Thanks, Chris! We appreciate you trusting us with the job." />
      <div style={{ position: "absolute", right: 26, top: -34, padding: "12px 24px", borderRadius: 999, background: theme.colors.bgAlt, border: `1.5px solid ${theme.colors.brass}`, color: theme.colors.brass, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.12em" }}>
        UNLIMITED
      </div>
    </div>
  );
};
