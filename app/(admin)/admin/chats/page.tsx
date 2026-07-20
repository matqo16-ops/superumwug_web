import Link from "next/link";
import {
  isDbConfigured,
  listConversations,
  listUserMessageTexts,
  type ConversationFilters,
} from "@/lib/db";
import { tallyTopics } from "@/lib/topics";

export const dynamic = "force-dynamic";

function parseFilters(params: {
  lang?: string;
  from?: string;
  to?: string;
}): ConversationFilters {
  const isDate = (value?: string) => value && /^\d{4}-\d{2}-\d{2}$/.test(value);
  return {
    language: params.lang === "de" || params.lang === "en" ? params.lang : undefined,
    from: isDate(params.from) ? params.from : undefined,
    to: isDate(params.to) ? params.to : undefined,
  };
}

export default async function AdminChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);

  if (!isDbConfigured()) {
    return (
      <main>
        <h1 className="font-display text-3xl font-semibold text-navy">
          Chat-Protokolle
        </h1>
        <p className="mt-4 rounded-lg border border-error/30 bg-error/10 p-4 text-error">
          DATABASE_URL ist nicht gesetzt. Neon-Datenbank über den Vercel
          Marketplace verbinden und <code>npm run migrate</code> ausführen —
          siehe DEPLOY.md.
        </p>
      </main>
    );
  }

  const [conversations, userTexts] = await Promise.all([
    listConversations(filters),
    listUserMessageTexts(filters),
  ]);
  const topics = tallyTopics(userTexts);

  return (
    <main>
      <h1 className="font-display text-3xl font-semibold text-navy">
        Chat-Protokolle
      </h1>
      <p className="mt-1 text-sm text-anthracite/70">
        {conversations.length} Unterhaltungen (neueste zuerst)
      </p>

      {/* Filters */}
      <form
        method="get"
        className="mt-6 flex flex-wrap items-end gap-4 rounded-lg border border-hairline bg-white p-4"
      >
        <label className="text-sm">
          <span className="mb-1 block font-medium text-anthracite">Sprache</span>
          <select
            name="lang"
            defaultValue={filters.language ?? ""}
            className="rounded-md border border-hairline px-3 py-1.5"
          >
            <option value="">Alle</option>
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-anthracite">Von</span>
          <input
            type="date"
            name="from"
            defaultValue={filters.from ?? ""}
            className="rounded-md border border-hairline px-3 py-1.5"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-anthracite">Bis</span>
          <input
            type="date"
            name="to"
            defaultValue={filters.to ?? ""}
            className="rounded-md border border-hairline px-3 py-1.5"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Filtern
        </button>
        <Link href="/admin/chats" className="text-sm text-anthracite/70 underline">
          Zurücksetzen
        </Link>
      </form>

      {/* Frequent topics */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy">
          Häufige Themen
        </h2>
        {topics.length === 0 ? (
          <p className="mt-2 text-sm text-anthracite/70">
            Noch keine Nutzer-Nachrichten im gewählten Zeitraum.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {topics.map((entry) => (
              <li
                key={entry.topic}
                className="rounded-full border border-hairline bg-white px-3 py-1 text-sm"
              >
                {entry.topic}:{" "}
                <span className="font-semibold text-navy">{entry.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Conversation list */}
      <section className="mt-8">
        {conversations.length === 0 ? (
          <p className="rounded-lg border border-hairline bg-white p-6 text-anthracite/70">
            Keine Unterhaltungen gefunden.
          </p>
        ) : (
          <table className="w-full border-collapse overflow-hidden rounded-lg border border-hairline bg-white text-sm">
            <thead>
              <tr className="bg-navy text-left text-white">
                <th className="px-4 py-2.5 font-semibold">Beginn</th>
                <th className="px-4 py-2.5 font-semibold">Sprache</th>
                <th className="px-4 py-2.5 font-semibold">Seite</th>
                <th className="px-4 py-2.5 font-semibold">Nachrichten</th>
                <th className="px-4 py-2.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conversation) => (
                <tr
                  key={conversation.id}
                  className="border-t border-hairline hover:bg-cream"
                >
                  <td className="px-4 py-2.5">
                    {new Date(conversation.started_at).toLocaleString("de-DE")}
                  </td>
                  <td className="px-4 py-2.5 uppercase">
                    {conversation.language}
                  </td>
                  <td className="px-4 py-2.5">{conversation.page}</td>
                  <td className="px-4 py-2.5">{conversation.message_count}</td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/admin/chats/${conversation.id}`}
                      className="font-semibold text-gold-deep underline"
                    >
                      Ansehen
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
