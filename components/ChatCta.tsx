import type { CommonContent } from "@/lib/content-types";
import { eyebrow } from "@/lib/styles";
import { CallbackButton } from "./CallbackButton";
import { ChatCtaButton } from "./ChatCtaButton";

/** The site-wide chatbot CTA banner — present on every page. */
export function ChatCta({ content }: { content: CommonContent["chatCta"] }) {
  return (
    <section className="bg-anthracite">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className={eyebrow}>{content.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-white">
            {content.headline}
          </h2>
          <p className="mt-3 leading-relaxed text-white/75">{content.body}</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3">
          <ChatCtaButton className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M9 1.5c-4.14 0-7.5 2.86-7.5 6.38 0 1.98 1.06 3.75 2.72 4.92-.1.86-.44 1.94-1.22 2.7 1.53-.1 2.76-.68 3.6-1.28.76.22 1.57.34 2.4.34 4.14 0 7.5-2.86 7.5-6.38S13.14 1.5 9 1.5Z"
                fill="currentColor"
              />
            </svg>
            {content.button}
          </ChatCtaButton>
          <CallbackButton className="text-sm text-white/70 underline decoration-gold/50 underline-offset-4 hover:text-gold">
            {content.secondary}
          </CallbackButton>
        </div>
      </div>
    </section>
  );
}
