import type { ReactNode } from "react";
import Image from "next/image";
import type { Hero as HeroContent } from "@/lib/content-types";
import { eyebrow } from "@/lib/styles";

const CHARACTER_SRC = "/images/header-char.png";

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
  /** Alt text for the brand character; omit to hide it. */
  character?: string;
}) {
  return (
    <div className="bg-navy-deep">
      <div
        className={`mx-auto max-w-6xl px-6 pb-14 pt-8 md:pb-20 md:pt-16 ${
          character ? "lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10" : ""
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

          {/* Below lg the character sits beside the CTAs rather than under them. */}
          {(actions || character) && (
            <div className="mt-8 flex items-end justify-between gap-4">
              {actions && (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                  {actions}
                </div>
              )}
              {character && (
                <Image
                  src={CHARACTER_SRC}
                  alt={character}
                  width={940}
                  height={1592}
                  priority
                  className="block h-36 w-auto shrink-0 sm:h-44 lg:hidden"
                  sizes="110px"
                />
              )}
            </div>
          )}

          {badges && badges.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
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

        {/* Desktop: aligned to the top of the hero so the whole figure stays above the fold. */}
        {character && (
          <Image
            src={CHARACTER_SRC}
            alt=""
            aria-hidden="true"
            width={940}
            height={1592}
            priority
            className="hidden h-[23rem] w-auto lg:block xl:h-[25rem]"
            sizes="250px"
          />
        )}
      </div>
    </div>
  );
}
