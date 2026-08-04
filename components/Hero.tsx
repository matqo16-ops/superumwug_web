import type { ReactNode } from "react";
import Image from "next/image";
import type { Hero as HeroContent } from "@/lib/content-types";
import { eyebrow } from "@/lib/styles";

/** Shared page hero on deep navy — headline in Fraunces, restrained gold accents. */
export function Hero({
  content,
  actions,
  badges,
  character,
}: {
  content: HeroContent;
  /** Rendered CTA buttons (client components wired to modal/chat). */
  actions?: ReactNode;
  badges?: string[];
  /** Alt text for the brand character shown on the right; omit to hide it. */
  character?: string;
}) {
  return (
    <div className="bg-navy-deep">
      <div
        className={`mx-auto max-w-6xl px-6 py-20 md:py-28 ${
          character ? "lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10" : ""
        }`}
      >
        <div>
        <p className={eyebrow}>{content.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight text-white md:text-5xl md:leading-tight">
          {content.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
          {content.subheadline}
        </p>
        {actions && <div className="mt-8 flex flex-wrap gap-4">{actions}</div>}
        {badges && badges.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-3">
            {badges.map((badge) => (
              <li
                key={badge}
                className="flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-sm font-medium text-gold"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M7 .8 8.8 4.6l4.2.6-3 3 .7 4.2L7 10.4l-3.7 2 .7-4.2-3-3 4.2-.6L7 .8Z"
                    fill="currentColor"
                    opacity="0.55"
                  />
                </svg>
                {badge}
              </li>
            ))}
          </ul>
        )}
        </div>

        {character && (
          <Image
            src="/images/header-char.png"
            alt={character}
            width={940}
            height={1592}
            priority
            className="mt-8 ml-auto block h-48 w-auto sm:h-64 lg:mt-0 lg:h-[26rem]"
            sizes="(min-width: 1024px) 260px, 170px"
          />
        )}
      </div>
    </div>
  );
}
