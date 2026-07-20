import { neon } from "@neondatabase/serverless";

export interface StoredChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationSummary {
  id: string;
  started_at: string;
  updated_at: string;
  language: string;
  page: string;
  message_count: number;
}

export interface ConversationDetail {
  id: string;
  started_at: string;
  updated_at: string;
  language: string;
  page: string;
  messages: StoredChatMessage[];
}

function getSql() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Upserts the full transcript for a session. Called after each completed
 * exchange; failures are logged but never break the chat itself.
 */
export async function saveConversation(
  id: string,
  language: string,
  page: string,
  messages: StoredChatMessage[],
): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  await sql`
    INSERT INTO chat_conversations (id, language, page, messages)
    VALUES (${id}, ${language}, ${page}, ${JSON.stringify(messages)}::jsonb)
    ON CONFLICT (id) DO UPDATE
      SET messages = EXCLUDED.messages,
          page = EXCLUDED.page,
          updated_at = now()
  `;
}

export interface ConversationFilters {
  language?: string;
  /** ISO date (inclusive lower bound). */
  from?: string;
  /** ISO date (exclusive upper bound). */
  to?: string;
}

export async function listConversations(
  filters: ConversationFilters = {},
): Promise<ConversationSummary[]> {
  const sql = getSql();
  if (!sql) return [];
  const language = filters.language ?? null;
  const from = filters.from ?? null;
  const to = filters.to ?? null;
  const rows = await sql`
    SELECT id, started_at, updated_at, language, page,
           jsonb_array_length(messages) AS message_count
    FROM chat_conversations
    WHERE (${language}::text IS NULL OR language = ${language})
      AND (${from}::timestamptz IS NULL OR started_at >= ${from}::timestamptz)
      AND (${to}::timestamptz IS NULL OR started_at < ${to}::timestamptz)
    ORDER BY started_at DESC
    LIMIT 200
  `;
  return rows as ConversationSummary[];
}

export async function getConversation(
  id: string,
): Promise<ConversationDetail | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql`
    SELECT id, started_at, updated_at, language, page, messages
    FROM chat_conversations
    WHERE id = ${id}
    LIMIT 1
  `;
  return (rows[0] as ConversationDetail | undefined) ?? null;
}

/** All user-authored message texts, for the "frequent topics" tally. */
export async function listUserMessageTexts(
  filters: ConversationFilters = {},
): Promise<string[]> {
  const sql = getSql();
  if (!sql) return [];
  const language = filters.language ?? null;
  const from = filters.from ?? null;
  const to = filters.to ?? null;
  const rows = await sql`
    SELECT msg->>'content' AS content
    FROM chat_conversations,
         jsonb_array_elements(messages) AS msg
    WHERE msg->>'role' = 'user'
      AND (${language}::text IS NULL OR language = ${language})
      AND (${from}::timestamptz IS NULL OR started_at >= ${from}::timestamptz)
      AND (${to}::timestamptz IS NULL OR started_at < ${to}::timestamptz)
    LIMIT 5000
  `;
  return (rows as { content: string }[]).map((row) => row.content);
}
