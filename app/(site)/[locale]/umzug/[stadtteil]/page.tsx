import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  getCommon,
  getStadtteil,
  getStadtteilSlugs,
  getUmzug,
} from "@/lib/content";
import { absoluteUrl, AREAS_SERVED, BUSINESS_ID } from "@/lib/schema";
import { SITE_URL } from "@/lib/seo";
import { btnOutlineOnDark, btnPrimary } from "@/lib/styles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CallbackButton } from "@/components/CallbackButton";
import { ChatCta } from "@/components/ChatCta";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { CrossLinks, PricingTable } from "@/components/ServiceSections";
import { Section, SectionHeading } from "@/components/Section";

interface Props {
  params: Promise<{ locale: Locale; stadtteil: string }>;
}

// German only — these pages target German city-district queries.
export function generateStaticParams() {
  return getStadtteilSlugs().map((stadtteil) => ({ locale: "de", stadtteil }));
}

function urlFor(slug: string) {
  return `${SITE_URL}/umzug/${slug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, stadtteil } = await params;
  if (locale !== "de" || !getStadtteilSlugs().includes(stadtteil)) return {};
  const d = getStadtteil(stadtteil);
  const url = urlFor(stadtteil);
  // Both templates are budgeted against the longest district name in the set
  // (Neuhausen-Nymphenburg, 21 chars) so every generated page stays inside
  // what Google renders before truncating: title <=60 chars, description
  // <=160. Measured, not guessed — see the district metadata check in the
  // SEO audit.
  return {
    title: `Umzug München-${d.name} — Festpreis`,
    description: `Umzug in München-${d.name}: ${d.intro.slice(0, 80)}… Festpreis nach Besichtigung.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Umzug München-${d.name} — Festpreis nach Besichtigung`,
      description: d.intro,
      url,
      siteName: "mmoving.de",
      locale: "de_DE",
      type: "website",
      images: [`${SITE_URL}/images/og-image.jpg`],
    },
  };
}

export default async function StadtteilPage({ params }: Props) {
  const { locale, stadtteil } = await params;
  if (locale !== "de" || !getStadtteilSlugs().includes(stadtteil)) notFound();
  setRequestLocale(locale);

  const d = getStadtteil(stadtteil);
  const umzug = getUmzug("de");
  const common = getCommon("de");
  const url = urlFor(stadtteil);

  // Five nearest siblings, by the neighbour list the research produced.
  const others = getStadtteilSlugs()
    .filter((s) => s !== stadtteil)
    .map((s) => getStadtteil(s));
  const neighbours = others
    .filter((o) => d.neighbours.some((n) => o.name.includes(n) || n.includes(o.name)))
    .concat(others)
    .filter((o, i, arr) => arr.findIndex((x) => x.slug === o.slug) === i)
    .slice(0, 5);

  const blocks = [
    { heading: "Bebauung und Treppenhäuser", body: d.buildingStock },
    { heading: "Parken und Halteverbotszone", body: d.parking },
    { heading: "Zufahrt und Straßen", body: d.access },
    ...(d.typicalMove
      ? [{ heading: `Typische Umzüge in ${d.name}`, body: d.typicalMove }]
      : []),
  ];

  return (
    <>
      {/* Service scoped to this district. The full LocalBusiness block stays on
          the homepage — children reference it by @id instead of restating it. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${url}#service`,
          serviceType: "Umzugsunternehmen",
          name: `Umzug in München-${d.name}`,
          description: d.intro,
          url,
          provider: { "@id": BUSINESS_ID },
          areaServed: {
            "@type": "Place",
            name: `München-${d.name}`,
            containedInPlace: { "@type": "City", name: "München" },
          },
        }}
      />

      <Hero
        content={{
          eyebrow: d.bezirk ?? "München",
          headline: `Umzug in München-${d.name}`,
          subheadline: d.intro,
          primaryCta: "Rückruf anfordern",
          secondaryCta: "Preise ansehen",
        }}
        character={common.characters.umzug}
        actions={
          <>
            <CallbackButton className={btnPrimary}>
              Rückruf anfordern
            </CallbackButton>
            <Link href="/umzug" className={btnOutlineOnDark}>
              Alle Umzugsleistungen
            </Link>
          </>
        }
      />

      <Breadcrumbs
        label="Breadcrumb"
        items={[
          { label: "Startseite", href: "/", url: absoluteUrl("de", "/") },
          { label: "Umzug", href: "/umzug", url: absoluteUrl("de", "/umzug") },
          { label: `München-${d.name}`, url },
        ]}
      />

      <Section variant="light">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {blocks.map((b) => (
            <div key={b.heading}>
              <h2 className="font-display text-lg font-semibold text-navy">
                {b.heading}
              </h2>
              <p className="mt-2 leading-relaxed text-anthracite/85">{b.body}</p>
            </div>
          ))}
        </div>

        {d.landmarks.length > 0 && (
          <p className="mt-8 max-w-3xl text-sm text-anthracite/70">
            <span className="font-semibold text-navy">
              Wir fahren regelmäßig in {d.name}:
            </span>{" "}
            {d.landmarks.join(" · ")}
          </p>
        )}
      </Section>

      {/* Only rendered when the owner has supplied a real job — never invented. */}
      {d.reference && (
        <Section variant="cream">
          <SectionHeading>Ein Auftrag aus {d.name}</SectionHeading>
          <div className="mt-6 max-w-3xl rounded-xl border border-hairline bg-white p-6 shadow-card">
            <p className="leading-relaxed text-anthracite/90">
              {d.reference.summary}
            </p>
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {d.reference.volume && (
                <div>
                  <dt className="inline font-semibold text-navy">Volumen: </dt>
                  <dd className="inline text-anthracite/85">
                    {d.reference.volume}
                  </dd>
                </div>
              )}
              {d.reference.duration && (
                <div>
                  <dt className="inline font-semibold text-navy">Dauer: </dt>
                  <dd className="inline text-anthracite/85">
                    {d.reference.duration}
                  </dd>
                </div>
              )}
              {d.reference.price && (
                <div>
                  <dt className="inline font-semibold text-navy">Endpreis: </dt>
                  <dd className="inline text-anthracite/85">
                    {d.reference.price}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Section>
      )}

      <PricingTable content={umzug.pricing} />

      <Section variant="light">
        <SectionHeading intro="Wir ziehen im gesamten Stadtgebiet um — hier sind die Nachbarstadtteile.">
          Umzug in angrenzenden Stadtteilen
        </SectionHeading>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {neighbours.map((n) => (
            <li key={n.slug}>
              <Link
                href={{ pathname: "/umzug/[stadtteil]", params: { stadtteil: n.slug } }}
                className="block rounded-xl border border-hairline bg-white px-5 py-4 font-medium text-navy shadow-card transition-colors hover:border-gold hover:text-gold-deep"
              >
                Umzug in {n.name} →
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-anthracite/70">
          Halteverbotszone nötig?{" "}
          <Link
            href="/ratgeber/halteverbotszone-muenchen"
            className="font-medium text-gold-deep underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
          >
            Kosten, Fristen und Ablauf beim KVR
          </Link>
        </p>
      </Section>

      {/* Every district page previously linked only to /umzug and to other
          districts — the same "kombinieren" cross-sell the blog articles
          already make gets no path from here to /entruempelung, /renovierung
          or /komplettservice. Ten pages' worth of internal-link weight was
          reaching one page instead of four. */}
      <CrossLinks
        content={{
          headline: "Wenn zum Umzug noch mehr dazukommt",
          items: [
            {
              label: "Entrümpelung",
              body: "Alte Möbel und Sperriges direkt beim Auszug entsorgen, statt sie zweimal zu bewegen.",
              href: "/entruempelung",
            },
            {
              label: "Renovierung",
              body: "Die leere Wohnung streichen und ausbessern, bevor sie übergeben wird — 15 bis 30 % günstiger als möbliert.",
              href: "/renovierung",
            },
            {
              label: "Komplettservice",
              body: "Umzug, Entrümpelung und Renovierung als ein Auftrag mit einem Ansprechpartner und einem Festpreis.",
              href: "/komplettservice",
            },
          ],
        }}
      />

      <ChatCta content={common.chatCta} />

      <Section variant="light">
        <Faq
          headline={`Häufige Fragen zum Umzug in ${d.name}`}
          items={d.faq}
          pageUrl={url}
        />
      </Section>
    </>
  );
}
