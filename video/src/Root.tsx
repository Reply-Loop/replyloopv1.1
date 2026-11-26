import React from "react";
import { Composition } from "remotion";
import { MasterAd, MASTER_FRAMES } from "./MasterAd";
import { loadFonts } from "./fonts";

loadFonts();

export const Root: React.FC = () => (
  <>
    <Composition id="MasterAd" component={MasterAd} durationInFrames={MASTER_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ withMusic: true }} />
  </>
);
