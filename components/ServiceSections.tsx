import { Link } from "@/i18n/navigation";
import type { ServiceSeoContent, TitledItem } from "@/lib/content-types";
import { Section, SectionHeading } from "./Section";

/**
 * The repeated SEO/AEO blocks shared by every service landing page. Each block
 * is self-contained — heading, then a direct answer, then detail — so an
 * assistant can lift a single section without needing the rest of the page.
 */

export function ServiceLead({ text }: { text: string }) {
  return (
    <p className="max-w-3xl text-lg leading-relaxed text-anthracite/90">
      {text}
    </p>
  );
}

export function ServiceDetail({
  content,
}: {
  content: ServiceSeoContent["detail"];
}) {
  return (
    <Section variant="light">
      <SectionHeading>{content.headline}</SectionHeading>
      <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
        {content.sections.map((section) => (
          <div key={section.heading}>
            <h3 className="font-display text-lg font-semibold text-navy">
              {section.heading}
            </h3>
            <p className="mt-2 leading-relaxed text-anthracite/85">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function PricingTable({
  content,
}: {
  content: ServiceSeoContent["pricing"];
}) {
  return (
    <Section variant="cream" id="preise">
      <SectionHeading intro={content.intro}>{content.headline}</SectionHeading>

      <div className="mt-8 overflow-x-auto rounded-xl border border-hairline bg-white shadow-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-navy text-left text-white">
              {content.columns.map((column) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row) => (
              <tr key={row[0]} className="border-t border-hairline even:bg-cream/60">
                {row.map((cell, index) => (
                  <td
                    key={index}
                    className={`px-4 py-3 align-top ${
                      index === row.length - 1
                        ? "font-semibold text-navy"
                        : "text-anthracite/85"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {content.extras.map((extra) => (
          <li key={extra} className="flex gap-2.5 text-sm text-anthracite/85">
            <span aria-hidden="true" className="text-gold-deep">
              +
            </span>
            {extra}
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-3xl border-l-2 border-gold pl-4 text-sm leading-relaxed text-anthracite/70">
        {content.note}
      </p>
    </Section>
  );
}

export function Situations({
  content,
}: {
  content: { headline: string; items: TitledItem[] };
}) {
  return (
    <Section variant="light">
      <SectionHeading>{content.headline}</SectionHeading>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-hairline bg-white p-6 shadow-card"
          >
            <h3 className="font-display text-lg font-semibold text-navy">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-anthracite/85">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function AreasServed({
  content,
}: {
  content: ServiceSeoContent["areas"];
}) {
  return (
    <Section variant="navy">
      <SectionHeading onDark intro={content.body}>
        {content.headline}
      </SectionHeading>
      <ul className="mt-8 flex flex-wrap gap-2.5">
        {content.cities.map((city) => (
          <li
            key={city}
            className="rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-sm font-medium text-gold"
          >
            {city}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function CrossLinks({
  content,
}: {
  content: ServiceSeoContent["crossLinks"];
}) {
  return (
    <Section variant="cream">
      <SectionHeading>{content.headline}</SectionHeading>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {content.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-xl border border-hairline bg-white p-6 shadow-card transition-colors hover:border-gold"
          >
            <h3 className="font-display text-lg font-semibold text-navy group-hover:text-gold-deep">
              {item.label}
            </h3>
            <p className="mt-2 leading-relaxed text-anthracite/85">{item.body}</p>
            <span className="mt-3 inline-block font-semibold text-gold-deep">
              →
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function EntityFacts({
  content,
}: {
  content: ServiceSeoContent["entity"];
}) {
  return (
    <Section variant="light">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <SectionHeading>{content.headline}</SectionHeading>
          <p className="mt-4 leading-relaxed text-anthracite/85">{content.body}</p>
        </div>
        <dl className="rounded-xl border border-hairline bg-white p-6 shadow-card">
          {content.facts.map((fact, index) => (
            <div
              key={fact.label}
              className={`flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4 ${
                index > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <dt className="w-40 shrink-0 text-xs font-semibold uppercase tracking-wide text-anthracite/60">
                {fact.label}
              </dt>
              <dd className="text-sm text-anthracite/90">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
