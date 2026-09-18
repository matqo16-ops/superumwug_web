import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Every euro range the site states must come from a published price table —
 * or be listed below with the reason it is allowed. The tables have drifted
 * from the prose before: a "35–70 € pro m²" headline that did not reproduce
 * its own table, and a 70 m² example priced outside the 2-room row. A new
 * range that matches neither fails here instead of going live.
 */

// "700 – 1.400 €", "1.800 bis 3.500 €", "€1,800–3,500", "12 – 25 € / m²"
const RANGE =
  /(?:€\s?)?(\d{1,3}(?:[.,]\d{3})*(?:,\d{2})?)\s?(?:€\s?)?(?:–|-|bis|to)\s?(?:€\s?)?(\d{1,3}(?:[.,]\d{3})*(?:,\d{2})?)\s?(?:€|EUR)/g;

/** German "1.400" and English "1,400" are both thousands; "0,55" is decimal. */
function toNumber(s: string): number {
  if (/^\d{1,3}([.,]\d{3})+$/.test(s)) return Number(s.replace(/[.,]/g, ""));
  return Number(s.replace(",", "."));
}

const key = (m: RegExpMatchArray) => `${toNumber(m[1])}-${toNumber(m[2])}`;

/**
 * Ranges that are deliberately not table rows. Each needs a reason; an entry
 * without one is not an exception, it is drift.
 */
const ALLOWED: Record<string, string> = {
  // Derived from the tables
  "450-4500": "Lowest and highest Umzug table row, quoted as the overall span on the home page.",
  // Worked examples — each is a single case inside, or built from, the table bands
  "950-1250": "Umzugskosten example 1: one 2-room move, inside the 700–1.400 € row.",
  "2100-4900": "Umzugskosten example 2: sum of the 4-room row, full packing and kitchen rows.",
  "450-650": "Entrümpelung example 1: one cellar unit, inside the 300–800 € row.",
  "3100-4200": "Entrümpelung example 2: 3-room row plus floor surcharge, minus an agreed Wertanrechnung.",
  "6500-8500": "Entrümpelung example 3: one detached house, inside the 4.500–9.000 € row.",
  // Market comparisons for things the business does not price or sell
  "1-1.8": "Market per-km rate for long-distance moves, shown next to the site's own 0,55 €/km.",
  "250-500": "Market day rate of a third-party furniture lift; the business does not provide one.",
  "4800-7500": "Market figure for an office move; there is no published commercial-move row.",
  // Awaiting an owner decision — do not repeat on new pages until answered
  "60-150": "Market storage rate per m³ and month; own storage price not yet set (owner decision OD-9).",
  "3500-6000": "4-room clearance row in the cost article, not in the service table (owner decision OD-5).",
  "400-900": "Combined-job saving in euros; the savings percentage is unconfirmed (owner decision OD-7).",
};

const root = path.join(__dirname, "..", "content");

function contentFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      // Legal pages quote statutory and contractual figures, not prices.
      else if (/\.(json|md)$/.test(entry.name) && !/^(agb|datenschutz|impressum)\.json$/.test(entry.name)) out.push(p);
    }
  };
  walk(path.join(root, "de"));
  walk(path.join(root, "en"));
  return out;
}

function tableRanges(): Set<string> {
  const ranges = new Set<string>();
  for (const locale of ["de", "en"]) {
    for (const page of ["umzug", "entruempelung", "renovierung"]) {
      const { pricing } = JSON.parse(
        fs.readFileSync(path.join(root, locale, `${page}.json`), "utf8"),
      );
      for (const cell of [...pricing.rows.flat(), ...pricing.extras] as string[]) {
        for (const m of cell.matchAll(RANGE)) ranges.add(key(m));
      }
    }
  }
  return ranges;
}

describe("price consistency", () => {
  it("states no euro range that is neither a table row nor a documented exception", () => {
    const published = tableRanges();
    const stray: string[] = [];
    for (const file of contentFiles()) {
      const text = fs.readFileSync(file, "utf8");
      for (const m of text.matchAll(RANGE)) {
        const k = key(m);
        if (!published.has(k) && !(k in ALLOWED)) {
          stray.push(`${k}  ${path.relative(root, file)}  "${m[0]}"`);
        }
      }
    }
    expect([...new Set(stray)]).toEqual([]);
  });

  it("gives every exception a reason", () => {
    for (const [k, reason] of Object.entries(ALLOWED)) {
      expect(reason.trim().length, k).toBeGreaterThan(10);
    }
  });
});
