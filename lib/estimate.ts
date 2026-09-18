import type { ServiceSeoContent } from "./content-types";

/**
 * Cost estimates for the calculator pages, computed only from the published
 * price tables in content/de/umzug.json and entruempelung.json.
 *
 * Every figure is parsed from the same table cells and extras lines that the
 * service pages render, so the calculators cannot quote a number the site
 * does not publish, and a price change in the JSON flows through by itself.
 * If a line the calculator depends on disappears or changes shape, the parse
 * throws and the build fails — a silent 0 € would be worse than no page.
 *
 * Pure, no server-only imports: the client calculator runs the same code.
 */

type Pricing = ServiceSeoContent["pricing"];

export interface Band {
  low: number;
  high: number;
}

const toNumber = (n: string) => Number(n.replace(/\./g, "").replace(",", "."));

/** All euro/number figures in a string, in order. "ab 300 – 800 €" → [300, 800]. */
function numbers(text: string): number[] {
  return (text.match(/\d[\d.,]*/g) ?? []).map(toNumber).filter(Number.isFinite);
}

/** A total-price cell, e.g. "700 – 1.400 €" or "ab 300 – 800 €". */
export function parseBand(cell: string): Band {
  const nums = numbers(cell);
  if (!nums.length) throw new Error(`No price in "${cell}"`);
  return { low: Math.min(...nums), high: Math.max(...nums) };
}

/** The extras line starting with `prefix`, e.g. "Verpackungsmaterial: 80 – 250 €". */
function extraLine(pricing: Pricing, prefix: string): string {
  const line = pricing.extras.find((e) => e.startsWith(prefix));
  if (!line) throw new Error(`Extras line "${prefix}" missing from pricing`);
  return line.slice(prefix.length);
}

/** Euro band of an extras line; a single figure ("300 €") gives low = high. */
export function extraBand(pricing: Pricing, prefix: string): Band {
  // Only the part before a parenthesis: "300 € (Beantragung rund 3 Wochen…)"
  // must not pick up the 3.
  return parseBand(extraLine(pricing, prefix).split("(")[0]);
}

/** Percentage band of an extras line: "8–15 %" → { low: 0.08, high: 0.15 }. */
export function percentBand(pricing: Pricing, prefix: string): Band {
  const b = parseBand(extraLine(pricing, prefix));
  return { low: b.low / 100, high: b.high / 100 };
}

/** Index of the column whose heading names the price ("Marktüblich (brutto)"). */
function priceColumn(pricing: Pricing): number {
  const index = pricing.columns.findIndex((c) => /brutto|preis/i.test(c));
  if (index < 0) throw new Error("No price column in pricing table");
  return index;
}

export interface TableRow {
  /** First cell, e.g. "2 Zimmer, 55–70 m²". */
  label: string;
  /** Second cell, e.g. "20–30 m³" or "55–70 m²". */
  detail: string;
  band: Band;
}

export function tableRows(pricing: Pricing): TableRow[] {
  const col = priceColumn(pricing);
  return pricing.rows.map((row) => ({
    label: row[0],
    detail: row[1],
    band: parseBand(row[col]),
  }));
}

const add = (a: Band, b: Band): Band => ({ low: a.low + b.low, high: a.high + b.high });
const times = (b: Band, n: number): Band => ({ low: b.low * n, high: b.high * n });

/** Rounded to 10 € — the inputs are ranges, precision beyond that is false. */
export const roundBand = (b: Band): Band => ({
  low: Math.round(b.low / 10) * 10,
  high: Math.round(b.high / 10) * 10,
});

export function formatEuro(n: number): string {
  return `${n.toLocaleString("de-DE")} €`;
}

export function formatBand(b: Band): string {
  const r = roundBand(b);
  return r.low === r.high
    ? formatEuro(r.low)
    : `${r.low.toLocaleString("de-DE")} – ${formatEuro(r.high)}`;
}

/* ───────────────────────────── Umzug ───────────────────────────── */

/** Everything the Umzug calculator needs, parsed once on the server. */
export interface UmzugRates {
  rows: TableRow[];
  zone: Band;
  material: Band;
  fullPacking: Band;
  furniture: Band;
  kitchen: Band;
}

export function umzugRates(pricing: Pricing): UmzugRates {
  return {
    rows: tableRows(pricing),
    zone: extraBand(pricing, "Halteverbotszone je Adresse:"),
    material: extraBand(pricing, "Verpackungsmaterial:"),
    fullPacking: extraBand(pricing, "Vollverpackung durch das Team:"),
    furniture: extraBand(pricing, "Möbeldemontage und -montage:"),
    kitchen: extraBand(pricing, "Küchenab- und -aufbau:"),
  };
}

export interface UmzugOptions {
  /** Index into rates.rows. */
  size: number;
  /** Halteverbotszonen, one per address that needs one. */
  zones: number;
  material: boolean;
  fullPacking: boolean;
  furniture: boolean;
  kitchen: boolean;
}

export function estimateUmzug(rates: UmzugRates, o: UmzugOptions): Band {
  const row = rates.rows[o.size];
  if (!row) throw new Error(`No Umzug row ${o.size}`);
  let total = add(row.band, times(rates.zone, o.zones));
  if (o.material) total = add(total, rates.material);
  if (o.fullPacking) total = add(total, rates.fullPacking);
  if (o.furniture) total = add(total, rates.furniture);
  if (o.kitchen) total = add(total, rates.kitchen);
  return total;
}

/* ────────────────────────── Entrümpelung ────────────────────────── */

export interface EntruempelungRates {
  rows: TableRow[];
  /** Per floor without a lift, as a fraction of the base price. */
  floor: Band;
  /** "ab 150 €" — a minimum, so the calculator marks the high end as open. */
  hazardous: Band;
  zone: Band;
  /** Per m² of floor area. */
  cleaning: Band;
}

export function entruempelungRates(pricing: Pricing): EntruempelungRates {
  return {
    rows: tableRows(pricing),
    floor: percentBand(pricing, "Zuschlag je Etage ohne Aufzug:"),
    hazardous: extraBand(pricing, "Sondermüll (Farben, Öle, Chemikalien):"),
    zone: extraBand(pricing, "Halteverbotszone:"),
    cleaning: extraBand(pricing, "Endreinigung über besenrein hinaus:"),
  };
}

export interface EntruempelungOptions {
  object: number;
  /** Floors to carry without a lift; 0 for ground floor or a lift. */
  floors: number;
  hazardous: boolean;
  zone: boolean;
  /** m² for Endreinigung beyond besenrein; 0 for none. */
  cleaningM2: number;
}

export function estimateEntruempelung(
  rates: EntruempelungRates,
  o: EntruempelungOptions,
): Band {
  const row = rates.rows[o.object];
  if (!row) throw new Error(`No Entrümpelung row ${o.object}`);
  // "je Etage" — the surcharge applies once per floor, on the base price.
  let total: Band = {
    low: row.band.low * (1 + rates.floor.low * o.floors),
    high: row.band.high * (1 + rates.floor.high * o.floors),
  };
  if (o.hazardous) total = add(total, rates.hazardous);
  if (o.zone) total = add(total, rates.zone);
  if (o.cleaningM2 > 0) total = add(total, times(rates.cleaning, o.cleaningM2));
  return total;
}


/**
 * Fills {placeholders} in a content string. Throws on any placeholder left
 * unfilled, so a renamed key fails the build instead of printing "{base}".
 */
export function fillTemplate(template: string, values: Record<string, string>): string {
  const out = template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
  const missing = out.match(/\{\w+\}/);
  if (missing) throw new Error(`Unfilled placeholder ${missing[0]} in "${template}"`);
  return out;
}

/** "8–15 %" style label for a fractional band. */
export function formatPercentBand(b: Band): string {
  return `${Math.round(b.low * 100)} bis ${Math.round(b.high * 100)} %`;
}
