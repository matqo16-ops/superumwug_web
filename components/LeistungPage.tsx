import { Link } from "@/i18n/navigation";
import type { Locale, StaticPathname } from "@/i18n/routing";
import {
  getCommon,
  getEntruempelung,
  getRenovierung,
  getSiteData,
  getUmzug,
} from "@/lib/content";
import type { Leistung } from "@/lib/leistungen";
import { telHref } from "@/lib/phone";
import { absoluteUrl, AREAS_SERVED, BUSINESS_ID } from "@/lib/schema";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "./Breadcrumbs";
import { CallbackButton } from "./CallbackButton";
import { ChatCta } from "./ChatCta";
import { Faq } from "./Faq";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { Section, SectionHeading } from "./Section";
import { PricingTable } from "./ServiceSections";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

/** A sub-service guide page (content/de/leistungen) — see lib/leistungen.ts. */
export function LeistungPage({
  locale,
  href,
  page,
}: {
  locale: Locale;
  href: StaticPathname;
  page: Leistung;
}) {
  const common = getCommon(locale);
  const site = getSiteData();
  const url = absoluteUrl(locale, href);
  const phone = site.organization.phone[locale];

  const source = { umzug: getUmzug, entruempelung: getEntruempelung, renovierung: getRenovierung }[
    page.pricing
  ](locale).pricing;
  // Only the rows this sub-service is about; the figures are the hub's, unchanged.
  const pricing = page.rows
    ? { ...source, rows: source.rows.filter((row) => page.rows!.includes(row[0])) }
    : source;
  if (page.rows && pricing.rows.length !== page.rows.length) {
    throw new Error(`${page.slug}: a listed price row is missing from the ${page.pricing} table`);
  }

  const character =
    common.characters[page.pricing === "renovierung" ? "bayreno" : page.pricing === "umzug" ? "umzug" : "entruempelung"];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${url}#service`,
          serviceType: page.serviceType,
          name: page.hero.headline,
          description: page.description,
          url,
          provider: { "@id": BUSINESS_ID },
          brand: { "@type": "Brand", name: page.brand },
          areaServed: AREAS_SERVED.map((name) => ({ "@type": "City", name })),
        }}
      />
      {page.steps.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "HowTo",
            "@id": `${url}#howto`,
            name: page.howToName ?? page.hero.headline,
            step: page.steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.name,
              text: step.text,
            })),
          }}
        />
      )}

      <Hero
        content={page.hero}
        character={character}
        actions={
          <>
            <CallbackButton className={btnPrimary}>{page.hero.primaryCta}</CallbackButton>
            <Link href={page.parent.href} className={btnOutlineOnDark}>
              {page.hero.secondaryCta}
            </Link>
          </>
        }
      />

      <Breadcrumbs
        label="Breadcrumb"
        items={[
          { label: "Startseite", href: "/", url: absoluteUrl(locale, "/") },
          {
            label: page.parent.label,
            href: page.parent.href,
            url: absoluteUrl(locale, page.parent.href),
          },
          { label: page.hero.eyebrow, url },
        ]}
      />

      <article>
        <Section variant="cream">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-deep">
              <time dateTime={page.datePublished}>{formatDate(page.datePublished)}</time>
              {page.dateModified && page.dateModified !== page.datePublished && (
                <>
                  {" · Aktualisiert am "}
                  <time dateTime={page.dateModified}>{formatDate(page.dateModified)}</time>
                </>
              )}
            </p>
            {/* Rendered from trusted local markdown in content/de/leistungen. */}
            <div className="prose-mmoving mt-6" dangerouslySetInnerHTML={{ __html: page.html }} />
          </div>
        </Section>

        <PricingTable content={pricing} />

        <Section variant="light">
          <Faq headline="Häufige Fragen" items={page.faq} pageUrl={url} />
        </Section>
      </article>

      <Section variant="navy">
        <SectionHeading onDark intro={page.cta.body}>
          {page.cta.headline}
        </SectionHeading>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <CallbackButton className={btnPrimary}>{common.header.callbackButton}</CallbackButton>
          <a href={telHref(phone)} className={btnOutlineOnDark}>
            {common.header.callLabel}: {phone}
          </a>
        </div>
      </Section>

      <Section variant="cream">
        <SectionHeading>Weiterlesen</SectionHeading>
        <ul className="mt-6 flex flex-wrap gap-3">
          {page.related.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-block rounded-lg border border-hairline bg-white px-4 py-2 font-medium text-navy shadow-card hover:border-gold hover:text-gold-deep"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <ChatCta content={common.chatCta} />
    </>
  );
}
