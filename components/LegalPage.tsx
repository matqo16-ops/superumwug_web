import type { LegalContent } from "@/lib/content-types";

/** Shared renderer for Impressum and Datenschutz. */
export function LegalPage({ content }: { content: LegalContent }) {
  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h1 className="font-display text-4xl font-semibold text-navy">
          {content.title}
        </h1>
        <p className="mt-3 text-anthracite/70">{content.intro}</p>
        <div className="mt-10 space-y-8">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-navy">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-2 leading-relaxed text-anthracite/90"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
