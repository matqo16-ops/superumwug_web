import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getB2b, getCommon } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { CallbackForm } from "@/components/CallbackForm";
import { ChatCta } from "@/components/ChatCta";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/b2b", getB2b(locale).meta);
}

function BenefitGrid({
  benefits,
}: {
  benefits: { title: string; body: string }[];
}) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {benefits.map((benefit) => (
        <div
          key={benefit.title}
          className="rounded-xl border border-hairline bg-white p-6 shadow-card"
        >
          <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-navy">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-gold-deep"
            >
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="m5.5 9 2.3 2.3L12.5 6.6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {benefit.title}
          </h3>
          <p className="mt-2 leading-relaxed text-anthracite/85">
            {benefit.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default async function B2bPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getB2b(locale);
  const common = getCommon(locale);

  return (
    <>
      <Hero content={content.hero} />

      <Section variant="cream">
        <SectionHeading intro={content.referral.body}>
          {content.referral.headline}
        </SectionHeading>
        <BenefitGrid benefits={content.referral.benefits} />
      </Section>

      <Section variant="light">
        <SectionHeading intro={content.corporate.body}>
          {content.corporate.headline}
        </SectionHeading>
        <BenefitGrid benefits={content.corporate.benefits} />
      </Section>

      <ChatCta content={common.chatCta} />

      {/* Partner callback form with audience selector */}
      <Section variant="cream" id="partner-formular">
        <div className="mx-auto max-w-xl">
          <SectionHeading intro={content.form.body}>
            {content.form.headline}
          </SectionHeading>
          <div className="mt-8 rounded-xl border border-hairline bg-white p-6 shadow-card sm:p-8">
            <CallbackForm
              form={common.callbackForm}
              initialTopic="b2b"
              idPrefix="b2b"
              b2b={{
                selectorLabel: content.form.selectorLabel,
                selectorOptions: content.form.selectorOptions,
                companyLabel: content.form.companyLabel,
                submit: content.form.submit,
              }}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
