import Image from "next/image";

/**
 * Service-area map, rendered immediately — no click-to-load gate.
 *
 * The map is a self-hosted SVG generated from real WGS84 coordinates
 * (public/images/einsatzgebiet-muenchen.svg), so every town sits at its true
 * position and the 50 km ring is drawn to scale. Because nothing is fetched
 * from a third party, it paints instantly, costs no extra requests and needs no
 * cookie consent. The link below opens the interactive Google map in a new tab
 * for anyone who wants to pan and zoom.
 */
export function ServiceAreaMap({
  alt,
  openLabel,
  caption,
  mapUrl,
}: {
  alt: string;
  openLabel: string;
  caption: string;
  /** Where the "open in Google Maps" link points — the Business Profile. */
  mapUrl: string;
}) {
  return (
    <figure>
      <Image
        src="/images/einsatzgebiet-muenchen.svg"
        alt={alt}
        width={900}
        height={900}
        priority
        className="w-full rounded-xl border border-hairline shadow-card"
      />
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-anthracite/70">
        <span>{caption}</span>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gold-deep underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
        >
          {openLabel} ↗
        </a>
      </figcaption>
    </figure>
  );
}
