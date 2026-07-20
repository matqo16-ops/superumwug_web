/**
 * Simple keyword tally over user chat messages, so recurring questions can be
 * spotted and folded back into the FAQ / homepage content.
 */

const TOPIC_KEYWORDS: Record<string, string[]> = {
  "Preise / Pricing": ["preis", "kost", "price", "cost", "teuer", "euro", "€", "rabatt", "discount", "angebot", "quote"],
  "Umzug / Moving": ["umzug", "umzieh", "umzüge", "move", "moving", "transport", "kartons", "boxes"],
  "Entrümpelung / Clearance": ["entrümpel", "entruempel", "entsorg", "clearance", "haushaltsauflösung", "declutter", "besenrein", "sperrmüll", "disposal"],
  "Renovierung / Renovation": ["renovier", "renovat", "bayreno", "sanier", "maler", "paint", "refurbish"],
  "Garantie / Guarantee": ["garantie", "guarantee", "schaden", "schäden", "damage", "versicher", "insur", "erstattung", "compensation"],
  "Termine / Scheduling": ["termin", "wann ", "verfügbar", "avail", "schedul", "kurzfristig", "short notice", "datum"],
  "Pakete / Packages": ["paket", "package", "bundle", "komplett", "rundum", "besichtigungsservice", "inspection service"],
  "B2B / Partner": ["b2b", "partner", "provision", "commission", "vermittler", "firmenkund", "hausverwalt", "property manag", "makler", "agent"],
  "Einsatzgebiet / Service area": ["gebiet", "region", "münchen", "munich", "umgebung", "surround", "anfahrt", "outside", "außerhalb"],
};

export interface TopicCount {
  topic: string;
  count: number;
}

export function tallyTopics(texts: string[]): TopicCount[] {
  const counts = new Map<string, number>();
  for (const raw of texts) {
    const text = raw.toLowerCase();
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        counts.set(topic, (counts.get(topic) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}
