import { describe, expect, it } from "vitest";
import { tallyTopics } from "@/lib/topics";

describe("tallyTopics", () => {
  it("counts keyword hits per topic across messages", () => {
    const result = tallyTopics([
      "Was kostet ein Umzug nach Dachau?",
      "How much does a clearance cost?",
      "Gibt es eine Garantie bei Schäden?",
    ]);
    const byTopic = Object.fromEntries(
      result.map((entry) => [entry.topic, entry.count]),
    );
    expect(byTopic["Preise / Pricing"]).toBe(2);
    expect(byTopic["Umzug / Moving"]).toBe(1);
    expect(byTopic["Entrümpelung / Clearance"]).toBe(1);
    expect(byTopic["Garantie / Guarantee"]).toBe(1);
  });

  it("sorts topics by count descending", () => {
    const result = tallyTopics(["preis", "preis?", "umzug preis"]);
    expect(result[0].topic).toBe("Preise / Pricing");
    expect(result[0].count).toBe(3);
  });

  it("returns an empty list for no messages", () => {
    expect(tallyTopics([])).toEqual([]);
  });
});
