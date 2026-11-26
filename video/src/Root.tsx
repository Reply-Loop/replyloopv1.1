import { Composition } from "remotion";
import { Film } from "./Film";
import { DURATION_S, FPS, HEIGHT, WIDTH } from "./theme";

export const Root = () => (
  <Composition
    id="BrandFilm"
    component={Film}
    durationInFrames={DURATION_S * FPS}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
