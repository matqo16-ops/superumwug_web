import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCommon, getKontakt } from "@/lib/content";
import { absoluteUrl } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { CallbackForm } from "@/components/CallbackForm";
import { ChatCta } from "@/components/ChatCta";
import { Hero } from "@/components/Hero";
import { Section, SectionHeading } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { ServiceAreaMap } from "@/components/ServiceAreaMap";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "/kontakt", getKontakt(locale).meta);
}

export default async function KontaktPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getKontakt(locale);
  const common = getCommon(locale);

  return (
    <>
      <Hero content={content.hero} />

      <Breadcrumbs
        label="Breadcrumb"
        items={[
          {
            label: locale === "de" ? "Startseite" : "Home",
            href: "/",
            url: absoluteUrl(locale, "/"),
          },
          {
            label: locale === "de" ? "Kontakt" : "Contact",
            url: absoluteUrl(locale, "/kontakt"),
          },
        ]}
      />

      <Section variant="cream" id="callback">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading intro={content.form.body}>
              {content.form.headline}
            </SectionHeading>
            <div className="mt-8 rounded-xl border border-hairline bg-white p-6 shadow-card sm:p-8">
              <CallbackForm form={common.callbackForm} idPrefix="kontakt" />
            </div>
          </div>

          <div>
            <SectionHeading intro={content.serviceArea.body}>
              {content.serviceArea.headline}
            </SectionHeading>
            <div className="mt-8">
              <ServiceAreaMap
                alt={content.serviceArea.mapAlt}
                caption={content.serviceArea.mapCaption}
                openLabel={content.serviceArea.mapOpenLabel}
              />
            </div>

            <h3 className="mt-10 font-display text-xl font-semibold text-navy">
              {content.details.headline}
            </h3>
            <dl className="mt-4 space-y-3 rounded-xl border border-hairline bg-white p-6 shadow-card">
              {content.details.items.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-0.5 sm:flex-row sm:gap-4"
                >
                  <dt className="w-32 shrink-0 text-sm font-semibold uppercase tracking-wide text-anthracite/60">
                    {item.label}
                  </dt>
                  <dd className="text-anthracite/90">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <ChatCta content={common.chatCta} />

      <Section variant="light">
        <Faq
          headline={content.faq.headline}
          items={content.faq.items}
          pageUrl={absoluteUrl(locale, "/kontakt")}
        />
      </Section>
    </>
  );
}
