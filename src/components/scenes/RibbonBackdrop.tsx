/**
 * Hero backdrop for /home-care-agencies: the ribbon loop from the brand kit
 * (06-og-link-preview, cropped by `npm run brand:derive`).
 *
 * Desktop only. The <source> media queries mean phones and tablets never
 * download it; the fallback <img> src is an empty data URI. The art sits to
 * the right of the text column and fades into the ivory, so no text ever
 * sits on it. Static for reduced motion; a slow drift otherwise (CSS only).
 */
const EMPTY = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
const DESKTOP = "(min-width: 1024px)";

export function RibbonBackdrop() {
  return (
    <div aria-hidden className="ribbon-backdrop pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] max-w-[46rem] lg:block">
      <picture>
        <source
          media={DESKTOP}
          type="image/avif"
          srcSet="/brand/hca-ribbon-560.avif 560w, /brand/hca-ribbon-840.avif 840w"
          sizes="44vw"
        />
        <source
          media={DESKTOP}
          type="image/webp"
          srcSet="/brand/hca-ribbon-560.webp 560w, /brand/hca-ribbon-840.webp 840w"
          sizes="44vw"
        />
        <img
          src={EMPTY}
          alt=""
          width={774}
          height={907}
          decoding="async"
          className="size-full object-cover object-left [mask-image:linear-gradient(to_right,transparent,black_38%)]"
        />
      </picture>
    </div>
  );
}
