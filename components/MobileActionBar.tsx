"use client";

import { telHref } from "@/lib/phone";
import { CallbackButton } from "./CallbackButton";

/**
 * Phone-only bar pinned to the bottom of every page: call, or ask for a
 * callback. Most visitors from local search are on a phone, and until now the
 * only tap-to-call link was in the footer — at the very end of pages that run
 * to several thousand words. Hidden from md up, where the header already
 * carries the callback button.
 */
export function MobileActionBar({
  phone,
  callLabel,
  callbackLabel,
}: {
  phone: string;
  callLabel: string;
  callbackLabel: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] flex gap-2 border-t border-white/10 bg-navy-deep/95 px-3 py-2.5 backdrop-blur md:hidden">
      <a
        href={telHref(phone)}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gold px-3 py-3 text-base font-semibold text-navy"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M4.5 2.5h3l1.5 4-2 1.25a9 9 0 0 0 5.25 5.25L13.5 11l4 1.5v3a1.5 1.5 0 0 1-1.5 1.5A14 14 0 0 1 3 4a1.5 1.5 0 0 1 1.5-1.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        {callLabel}
      </a>
      {/* The chat bubble is lifted above this bar on phones (ChatWidget). */}
      <CallbackButton className="flex flex-1 items-center justify-center rounded-lg border border-white/60 px-3 py-3 text-base font-semibold text-white">
        {callbackLabel}
      </CallbackButton>
    </div>
  );
}
