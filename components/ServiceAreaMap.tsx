"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Two-click Google Maps embed.
 *
 * The iframe is only mounted after the visitor explicitly asks for it, so no
 * request reaches Google — and no consent banner is required — until then.
 * Until clicked, the hand-drawn service-area SVG is shown instead.
 */
export function ServiceAreaMap({
  placeholderAlt,
  loadLabel,
  privacyNote,
  mapTitle,
}: {
  placeholderAlt: string;
  loadLabel: string;
  privacyNote: string;
  mapTitle: string;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={mapTitle}
        // Munich city plus the metropolitan area, at a zoom that shows the
        // roughly 50 km service radius.
        src="https://www.google.com/maps?q=M%C3%BCnchen,%20Bayern,%20Deutschland&z=9&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[380px] w-full rounded-xl border border-hairline shadow-card"
        allowFullScreen
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-hairline shadow-card">
      <Image
        src="/images/muenchen-karte.svg"
        alt={placeholderAlt}
        width={800}
        height={600}
        className="w-full"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-deep/70 p-6 text-center">
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="rounded-lg bg-gold px-6 py-3 font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white"
        >
          {loadLabel}
        </button>
        <p className="max-w-sm text-xs leading-relaxed text-white/80">
          {privacyNote}
        </p>
      </div>
    </div>
  );
}
