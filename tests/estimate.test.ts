import { describe, expect, it } from "vitest";
import umzug from "../content/de/umzug.json";
import entruempelung from "../content/de/entruempelung.json";
import {
  entruempelungRates,
  estimateEntruempelung,
  estimateUmzug,
  formatBand,
  parseBand,
  umzugRates,
} from "../lib/estimate";

// These run against the real published tables, on purpose: the calculators
// must never quote a figure the service pages do not show.

describe("parseBand", () => {
  it("reads German thousands and the 'ab' prefix", () => {
    expect(parseBand("700 – 1.400 €")).toEqual({ low: 700, high: 1400 });
    expect(parseBand("ab 300 – 800 €")).toEqual({ low: 300, high: 800 });
  });
});

describe("Umzug rates", () => {
  const rates = umzugRates(umzug.pricing);

  it("reads every row and extra from the published table", () => {
    expect(rates.rows).toHaveLength(umzug.pricing.rows.length);
    expect(rates.rows[1].band).toEqual({ low: 700, high: 1400 });
    // The "(Beantragung rund 3 Wochen im Voraus)" must not leak a 3 in.
    expect(rates.zone).toEqual({ low: 300, high: 300 });
    expect(rates.kitchen).toEqual({ low: 400, high: 1200 });
  });

  it("adds a zone per address and the chosen extras", () => {
    const band = estimateUmzug(rates, {
      size: 1, zones: 2, material: false, fullPacking: false, furniture: true, kitchen: false,
    });
    // 700–1.400 + 2 × 300 + Möbelmontage 200–600
    expect(band).toEqual({ low: 1500, high: 2600 });
    expect(formatBand(band)).toBe("1.500 – 2.600 €");
  });
});

describe("Entrümpelung rates", () => {
  const rates = entruempelungRates(entruempelung.pricing);

  it("reads the per-floor surcharge as a fraction", () => {
    expect(rates.floor).toEqual({ low: 0.08, high: 0.15 });
    expect(rates.hazardous).toEqual({ low: 150, high: 150 });
    expect(rates.cleaning).toEqual({ low: 3, high: 8 });
  });

  it("applies the surcharge once per floor on the base price", () => {
    const band = estimateEntruempelung(rates, {
      object: 3, floors: 3, hazardous: false, zone: true, cleaningM2: 0,
    });
    // 2-Zimmer 1.800–3.500, 3 floors × 8–15 %, plus zone 300
    expect(band.low).toBeCloseTo(1800 * 1.24 + 300);
    expect(band.high).toBeCloseTo(3500 * 1.45 + 300);
  });
});
