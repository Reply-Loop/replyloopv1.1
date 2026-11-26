import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { hits } from "../audio/cues";
import { WordReveal } from "../components/motion";
import { ReviewCard, useHit, usePunch } from "../components/ui";
import { useExit } from "../components/layers";
import { clamp, theme } from "../theme";

// 0–5.3s. Thump #1 (frame 0): an unanswered 5-star review slams in over real
// footage of an owner on his phone. Thump #2: the reply types itself.
export const Hook: React.FC<{ sectionId?: string }> = ({ sectionId = "01-hook" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [h0, h1] = hits(sectionId);
  const card = useHit(h0, "snappy");
  const reply = interpolate(frame, [h1, h1 + 34], [0, 1], { easing: theme.ease.out, ...clamp });
  const punch = usePunch(h0, 0.05) * usePunch(h1, 0.03);
  const exit = useExit(10);
  const bgScale = interpolate(frame, [0, 160 * (sectionId === "01-hook" ? 1 : 0.5)], [1.55, 1.68], { easing: theme.ease.inOut, ...clamp });
  return (
    <AbsoluteFill>
      {/* Real footage: owner reading a review on his phone (burned-in copy cropped out). */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo src={staticFile("src/photo09-review-follow.mp4")} startFrom={Math.round(0.3 * fps)} playbackRate={0.58} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${bgScale})`, transformOrigin: "50% 92%", filter: "brightness(0.55) saturate(0.9) blur(1px)" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,23,26,1) 0%, rgba(20,23,26,1) 16%, rgba(20,23,26,0.6) 36%, rgba(20,23,26,0.25) 58%, rgba(20,23,26,0.92) 76%, rgba(20,23,26,1) 100%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ padding: `0 ${theme.layout.gutter}px`, paddingTop: 360, ...exit }}>
        <WordReveal
          text={"Your next customer is\nreading your unanswered\nGoogle reviews."}
          delay={2} per={2} highlight={["unanswered"]}
          style={{ fontFamily: theme.fonts.display, fontSize: 92, fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.03em", color: theme.colors.ivory }}
        />
        <div style={{ marginTop: 64, transform: `translateY(${interpolate(card, [0, 1], [180, 0])}px) scale(${interpolate(card, [0, 1], [0.8, 1]) * punch}) rotate(${interpolate(card, [0, 1], [-4, -1.2])}deg)`, opacity: card, transformOrigin: "50% 50%" }}>
          <ReviewCard
            width={912}
            name="Sam R."
            text="Showed up on time, explained everything, and left the place spotless. Highly recommend."
            replied={reply}
            reply="Thank you, Sam! It was a pleasure helping you. We'll see you next season."
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
