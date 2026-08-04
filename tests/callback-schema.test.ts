import { describe, expect, it } from "vitest";
import { callbackSchema } from "@/lib/callback-schema";

const validPayload = {
  name: "Max Mustermann",
  phone: "+49 89 1234567",
  preferredTime: "vormittags",
  topic: "umzug",
  consent: true,
  locale: "de",
  sourcePage: "/kontakt",
};

describe("callbackSchema", () => {
  it("accepts a valid payload", () => {
    expect(callbackSchema.safeParse(validPayload).success).toBe(true);
  });

  it("accepts the B2B variant fields", () => {
    const result = callbackSchema.safeParse({
      ...validPayload,
      topic: "b2b",
      partnerType: "vermittler",
      companyName: "Immo GmbH",
      message: "Wir vermitteln regelmäßig Kunden.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing consent", () => {
    expect(
      callbackSchema.safeParse({ ...validPayload, consent: false }).success,
    ).toBe(false);
  });

  it("rejects an invalid phone number", () => {
    expect(
      callbackSchema.safeParse({ ...validPayload, phone: "call me maybe" })
        .success,
    ).toBe(false);
  });

  it("accepts the as-soon-as-possible preferred time", () => {
    expect(
      callbackSchema.safeParse({ ...validPayload, preferredTime: "sofort" })
        .success,
    ).toBe(true);
  });

  it("accepts the current package topics", () => {
    for (const topic of [
      "paket-privatumzug",
      "paket-firmenumzug",
      "paket-vermieter",
      "besichtigungsservice",
    ]) {
      expect(callbackSchema.safeParse({ ...validPayload, topic }).success).toBe(
        true,
      );
    }
  });

  it("rejects retired package topics", () => {
    for (const topic of ["paket-3", "paket-4"]) {
      expect(callbackSchema.safeParse({ ...validPayload, topic }).success).toBe(
        false,
      );
    }
  });

  it("rejects an unknown preferred time", () => {
    expect(
      callbackSchema.safeParse({ ...validPayload, preferredTime: "midnight" })
        .success,
    ).toBe(false);
  });

  it("rejects an unknown topic", () => {
    expect(
      callbackSchema.safeParse({ ...validPayload, topic: "spam" }).success,
    ).toBe(false);
  });

  it("rejects a too-short name", () => {
    expect(
      callbackSchema.safeParse({ ...validPayload, name: "M" }).success,
    ).toBe(false);
  });
});
