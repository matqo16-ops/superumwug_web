import { describe, expect, it } from "vitest";
import { cutAtWord } from "../lib/text";

describe("cutAtWord", () => {
  it("leaves short text alone", () => {
    expect(cutAtWord("Umzug in Laim.", 155)).toBe("Umzug in Laim.");
  });

  it("never ends mid-word and stays within the limit", () => {
    const text =
      "Laim ist der 25. Stadtbezirk und liegt zwischen Schwanthalerhöhe im Osten und Pasing im Westen. Rund 20 Prozent der Bezirksfläche sind Bahngelände, und das prägt einen Umzug hier mehr als alles andere.";
    const out = cutAtWord(text, 155);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith("…")).toBe(true);
    expect(text.startsWith(out.slice(0, -1))).toBe(true);
    expect(text[out.length - 1]).toMatch(/[\s,.]/);
  });
});
