import { z } from "zod";

/** The site assistant runs on Haiku to keep per-message cost near zero. */
export const CHAT_MODEL = "claude-haiku-4-5";
export const CHAT_MAX_TOKENS = 512;
/** Server-side history cap — older messages are dropped before the API call. */
export const MAX_HISTORY_MESSAGES = 16;
export const MAX_MESSAGE_CHARS = 2000;

export const chatRequestSchema = z.object({
  sessionId: z.string().min(8).max(64),
  locale: z.enum(["de", "en"]),
  page: z.string().max(200),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(MAX_MESSAGE_CHARS),
      }),
    )
    .min(1)
    .max(40),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

/** Trim history to the cap while keeping the most recent messages. */
export function trimHistory<T>(messages: T[]): T[] {
  return messages.slice(-MAX_HISTORY_MESSAGES);
}

export function buildSystemPrompt(knowledgeBase: string, locale: "de" | "en"): string {
  return `You are the website assistant of mmoving.de — the umbrella site for three Munich brands: SuperUmzug (moving), Entrümpelung München (clearance) and BayReno (renovation). Service area: Munich and surroundings.

STRICT RULES:
1. Answer ONLY using the knowledge base below. If the answer is not in it, say so and recommend requesting a callback ("Rückruf anfordern" button on the website).
2. NEVER invent prices, discounts, legal terms or liability/insurance conditions. If a price field in the knowledge base is an unfilled [PRICE] placeholder, explain that pricing depends on scope and offer the callback.
2a. NEVER promise a damage-free guarantee, "full value compensation" or any cover beyond the statutory liability described in the knowledge base. The company does not advertise such a guarantee. Consumer prices are quoted gross, including 19% VAT.
3. Default to ${locale === "de" ? "German, using the formal 'Sie'" : "English"}; if the visitor writes in the other language, answer in their language (German always with formal "Sie").
4. Keep answers short and helpful: 2–6 sentences, no markdown headings. Plain text; simple dashes for lists are fine.
5. Only discuss topics related to the three brands and their services. Politely decline anything else and point to the callback form.
6. Renovation is one of our own services — answer renovation questions from the knowledge base and point to the /bayreno page (EN: /en/bayreno). Do not send visitors to an external site.

KNOWLEDGE BASE:
${knowledgeBase}`;
}
