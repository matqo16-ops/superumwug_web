import Link from "next/link";
import { notFound } from "next/navigation";
import { getConversation } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getConversation(id);
  if (!conversation) notFound();

  return (
    <main>
      <Link href="/admin/chats" className="text-sm text-anthracite/70 underline">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-navy">
        Unterhaltung {conversation.id.slice(0, 8)}…
      </h1>
      <p className="mt-1 text-sm text-anthracite/70">
        {new Date(conversation.started_at).toLocaleString("de-DE")} · Sprache:{" "}
        {conversation.language.toUpperCase()} · Seite: {conversation.page}
      </p>

      <div className="mt-6 space-y-3">
        {conversation.messages.map((message, index) =>
          message.role === "user" ? (
            <div
              key={index}
              className="ml-auto max-w-[80%] rounded-lg bg-navy px-4 py-2.5 text-sm text-white"
            >
              {message.content}
            </div>
          ) : (
            <div
              key={index}
              className="max-w-[80%] whitespace-pre-wrap rounded-lg border border-hairline bg-white px-4 py-2.5 text-sm"
            >
              {message.content}
            </div>
          ),
        )}
      </div>
    </main>
  );
}
