import fs from "fs";
import path from "path";
import { getPathname } from "@/i18n/navigation";
import { getBlogIndex } from "@/lib/blog";
import { getCommon, getStadtteil, getStadtteilSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

/** First sentence of a prose field — enough to tell one district from another. */
function firstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}

/**
 * Page lists that must match the site exactly. They were hand-written once and
 * drifted: the ten district pages and every English page were missing for
 * weeks. Generated from the same sources as the sitemap, they cannot drift.
 */
function generatedSections(): string {
  const lines: string[] = [];

  lines.push("## Kostenrechner", "");
  lines.push(
    `- ${SITE_URL}/umzugskosten-rechner — Umzugskosten-Rechner München: Schätzung nach Wohnungsgröße, Halteverbotszonen und Zusatzleistungen, vollständige Preismatrix als Tabelle`,
    `- ${SITE_URL}/entruempelung-kosten-rechner — Entrümpelung Kosten-Rechner München: Schätzung nach Objekt und Etagen ohne Aufzug, vollständige Preismatrix als Tabelle`,
    "",
  );

  lines.push("## Leistungsseiten", "");
  lines.push(
    `- ${SITE_URL}/haushaltsaufloesung-muenchen — Haushaltsauflösung München: Ablauf in 8 Schritten, Dauer, Unterschied zu Entrümpelung und Wohnungsauflösung, Hinweise im Todesfall, Orientierungswerte nach Wohnungsgröße`,
    `- ${SITE_URL}/keller-entruempeln-muenchen — Keller, Dachboden und Garage entrümpeln: Ablauf in 5 Schritten, Sondermüll, Kellerabteil beim Auszug, Orientierungswerte 300–800 € (Kellerabteil) und 600–1.600 € (Dachboden)`,
    "",
  );

  lines.push("## Germering — Sitz des Betriebs", "");
  lines.push(
    `- ${SITE_URL}/umzug-germering — Umzug Germering: Betrieb in der Ausburgerstraße 4; Halteverbot in Germering beim Straßenverkehrsamt der Stadt (nicht beim Münchner Mobilitätsreferat), mindestens zwei Wochen Bearbeitungszeit; Ummeldung innerhalb von zwei Wochen`,
    `- ${SITE_URL}/entruempelung-germering — Entrümpelung Germering: Wertstoffhöfe Landsberger Straße 1g und Starnberger Weg 56 (bis 2 m³), Sperrmüllabholung des Landkreises 80 € für bis zu 2 m³, Problemmüll donnerstags 14–18 Uhr`,
    "",
  );

  const districts = getStadtteilSlugs().map((slug) => getStadtteil(slug));
  if (districts.length) {
    lines.push("## Umzug nach Münchner Stadtteil", "");
    lines.push(
      "Jede Seite beschreibt Parksituation, Zufahrt und Gebäudebestand des Viertels und was das für einen Umzug bedeutet.",
      "",
    );
    for (const d of districts) {
      lines.push(`- ${SITE_URL}/umzug/${d.slug} — Umzug München-${d.name}: ${firstSentence(d.parking)}`);
    }
    lines.push("");
  }

  const articles = getBlogIndex();
  if (articles.length) {
    lines.push("## Ratgeber-Artikel", "");
    for (const a of articles) {
      lines.push(`- ${SITE_URL}/blog/${a.slug} — ${a.title}`);
    }
    lines.push("");
  }

  // English pages: the English footer lists exactly the pages that exist in
  // English, so it is the source here too.
  const en = getCommon("en");
  lines.push("## In English", "");
  lines.push(
    "The same business in English: moving (SuperUmzug), clearance (Entrümpelung München) and renovation (BayReno) in Munich and the surrounding area, since 2004. English-speaking advice line: +49 176 7091 1464. Advice in seven languages: German, English, Slovak, Czech, Polish, Ukrainian and Croatian. All prices are gross in euro, including 19 % VAT.",
    "",
    `- ${SITE_URL}${getPathname({ locale: "en", href: "/" })} — Home`,
  );
  const seen = new Set<string>();
  for (const column of en.footer.columns) {
    for (const link of column.links) {
      if (seen.has(link.href)) continue;
      seen.add(link.href);
      lines.push(`- ${SITE_URL}${link.href} — ${link.label}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}

/**
 * Serves /llms.txt — the plain-markdown summary LLM crawlers read to understand
 * the business. The prose lives in content/llms.txt so it stays editable
 * alongside the rest of the copy; page lists are appended from the content.
 */
export function GET(): Response {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "content", "llms.txt"),
    "utf8",
  );
  // Keep the file authored against the canonical domain even if the deployment
  // is previewed elsewhere.
  const prose = raw.replaceAll("https://mmoving.de", SITE_URL);

  // Generated lists go before the closing notes for citing systems.
  const marker = "## Hinweise für zitierende Systeme";
  const body = prose.includes(marker)
    ? prose.replace(marker, `${generatedSections()}\n${marker}`)
    : `${prose}\n${generatedSections()}`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
