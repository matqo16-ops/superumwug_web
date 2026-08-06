import type { FaqItem } from "@/lib/content-types";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "./JsonLd";
import { SectionHeading } from "./Section";

/**
 * Accessible FAQ accordion built on native <details>/<summary>, paired with the
 * FAQPage JSON-LD for the same items so the markup and the structured data can
 * never drift apart.
 *
 * Answers stay open-by-default for the first item: crawlers read the DOM either
 * way, but it makes the pattern obvious to a visitor at a glance.
 */
export function Faq({
  headline,
  items,
  pageUrl,
  intro,
}: {
  headline: string;
  items: FaqItem[];
  /** Absolute URL of the page, used for the FAQPage @id. */
  pageUrl?: string;
  intro?: string;
}) {
  return (
    <div>
      {pageUrl && <JsonLd data={faqSchema(items, pageUrl)} />}
      <SectionHeading intro={intro}>{headline}</SectionHeading>
      <div className="mt-8 max-w-3xl divide-y divide-hairline rounded-xl border border-hairline bg-white shadow-card">
        {items.map((item, index) => (
          <details
            key={item.question}
            open={index === 0}
            className="faq-item group px-6"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-medium text-navy hover:text-gold-deep">
              <h3 className="text-base font-medium">{item.question}</h3>
              <svg
                className="faq-chevron shrink-0 text-gold-deep transition-transform"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m3 6 5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <p className="pb-5 leading-relaxed text-anthracite/85">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
