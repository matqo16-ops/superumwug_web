import { describe, expect, it } from "vitest";
import site from "../content/site.json";
import { telHref } from "../lib/phone";

describe("telHref", () => {
  it("keeps the plus and every digit", () => {
    expect(telHref("+49 176 228 661 46")).toBe("tel:+4917622866146");
  });

  it("produces a dialable link for every published number", () => {
    const numbers = [
      ...Object.values(site.organization.phone),
      ...Object.values(site.organization.brandPhones),
    ];
    for (const n of numbers) expect(telHref(n)).toMatch(/^tel:\+\d{10,}$/);
  });

  it("refuses input that is not a number instead of emitting tel:+", () => {
    expect(() => telHref("+")).toThrow();
  });
});
