import React from "react";
import { ClipCard } from "../components/ClipCard";
import { AuditVisual, BacklogVisual, QrNfcVisual } from "../components/visuals";
import { theme } from "../theme";
import { PriceStack } from "./PriceStack";

export const Setup: React.FC = () => (
  <PriceStack
    sectionId="04-setup-499"
    index="02"
    eyebrow="Setup · paid once"
    amount={499}
    unit="one time"
    unitSub="Before onboarding begins"
    items={[
      { title: "Online presence audit", visual: (at) => <AuditVisual at={at} /> },
      {
        title: "Owner interview: your voice, your facts",
        visual: (at) => (
          <ClipCard src="photo11-ownerqa.mp4" startSec={0.9} width={912} aspect={0.62} focusY={60} delay={at} zoom={[1.04, 1.1]} label="Owner interview" />
        ),
      },
      { title: "Replies to your past unanswered reviews", visual: (at) => <BacklogVisual at={at} /> },
      { title: "Review QR codes + NFC tap cards", visual: (at) => <QrNfcVisual at={at} /> },
    ]}
    recap={
      <div>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 64, fontWeight: 600, color: theme.colors.ivory, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          $499, once.
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontSize: 30, color: theme.colors.ivoryDim, marginTop: 14, lineHeight: 1.4 }}>
          Your foundation, built one time. Never billed again.
        </div>
      </div>
    }
  />
);
