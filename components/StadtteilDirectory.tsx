import { Link } from "@/i18n/navigation";
import { getStadtteil, getStadtteilSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import { JsonLd } from "./JsonLd";
import { Section, SectionHeading } from "./Section";

/**
 * Links the Umzug hub to every district child, both visibly and as an
 * ItemList. Without this the district pages are orphans on a small domain and
 * tend to stall in "Crawled – currently not indexed".
 *
 * Renders nothing until district pages exist, so the hub is safe to ship first.
 */
export function StadtteilDirectory() {
  const districts = getStadtteilSlugs().map((slug) => getStadtteil(slug));
  if (districts.length === 0) return null;

  return (
    <Section variant="cream">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${SITE_URL}/umzug#stadtteile`,
          name: "Umzug in Münchner Stadtteilen",
          itemListElement: districts.map((d, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `Umzug in München-${d.name}`,
            url: `${SITE_URL}/umzug/${d.slug}`,
          })),
        }}
      />
      <SectionHeading intro="Was in Ihrem Stadtteil beim Umzug wirklich zählt — Treppenhäuser, Parksituation und Zufahrt, jeweils konkret.">
        Umzug in Ihrem Stadtteil
      </SectionHeading>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {districts.map((d) => (
          <li key={d.slug}>
            <Link
              href={{
                pathname: "/umzug/[stadtteil]",
                params: { stadtteil: d.slug },
              }}
              className="block rounded-xl border border-hairline bg-white px-5 py-4 shadow-card transition-colors hover:border-gold"
            >
              <span className="font-semibold text-navy">
                Umzug in {d.name}
              </span>
              {d.bezirk && (
                <span className="mt-0.5 block text-sm text-anthracite/65">
                  {d.bezirk}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
