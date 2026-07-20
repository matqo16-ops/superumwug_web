import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getPakete } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { CallbackButton } from "@/components/CallbackButton";
import { ChatCta } from "@/components/ChatCta";
import { ChatCtaButton } from "@/components/ChatCtaButton";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/pakete", getPakete(locale).meta);
}

export default async function PaketePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getPakete(locale);
  const common = getCommon(locale);
  const { labels } = content;

  return (
    <>
      <Hero content={content.hero} />

      <Section variant="cream">
        <div className="grid gap-8 lg:grid-cols-2">
          {content.packages.map((pkg) => (
            <article
              key={pkg.id}
              id={pkg.id}
              className="flex flex-col rounded-xl border border-hairline bg-white p-8 shadow-card"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {pkg.kicker}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-navy">
                {pkg.name}
              </h2>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-anthracite/60">
                {labels.forWhom}
              </h3>
              <p className="mt-1.5 leading-relaxed text-anthracite/90">
                {pkg.forWhom}
              </p>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-anthracite/60">
                {labels.included}
              </h3>
              <ol className="mt-3 space-y-3">
                {pkg.included.map((step, index) => (
                  <li key={step.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy font-display text-xs font-semibold text-gold"
                    >
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-navy">
                        {step.title}
                      </span>
                      <p className="text-sm leading-relaxed text-anthracite/80">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-anthracite/60">
                {labels.outcome}
              </h3>
              <p className="mt-1.5 leading-relaxed text-anthracite/90">
                {pkg.outcome}
              </p>

              <div className="mt-auto border-t border-hairline pt-6">
                <p className="mt-2 text-sm font-medium text-anthracite/70">
                  {labels.priceCtaLine}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <ChatCtaButton className="inline-flex items-center justify-center rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-deep hover:text-white">
                    {labels.chatButton}
                  </ChatCtaButton>
                  <CallbackButton
                    topic={pkg.id}
                    className="inline-flex items-center justify-center rounded-lg border-[1.5px] border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-gold-deep hover:text-gold-deep"
                  >
                    {labels.callbackButton}
                  </CallbackButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <ChatCta content={common.chatCta} />
    </>
  );
}
