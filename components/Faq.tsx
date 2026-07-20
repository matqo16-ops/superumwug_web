import type { FaqItem } from "@/lib/content-types";
import { SectionHeading } from "./Section";

/** Accessible FAQ accordion built on native <details>/<summary>. */
export function Faq({
  headline,
  items,
}: {
  headline: string;
  items: FaqItem[];
}) {
  return (
    <div>
      <SectionHeading>{headline}</SectionHeading>
      <div className="mt-8 max-w-3xl divide-y divide-hairline rounded-xl border border-hairline bg-white shadow-card">
        {items.map((item) => (
          <details key={item.question} className="faq-item group px-6">
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-medium text-navy hover:text-gold-deep">
              {item.question}
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
