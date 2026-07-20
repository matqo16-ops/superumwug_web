/**
 * Creates the chat-logging schema on the Neon Postgres database.
 * Idempotent — safe to run repeatedly.
 *
 * Usage:  DATABASE_URL=postgres://... npm run migrate
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Copy it from Vercel → Storage → Neon.");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS chat_conversations (
    id          TEXT PRIMARY KEY,
    started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    language    TEXT NOT NULL,
    page        TEXT NOT NULL,
    messages    JSONB NOT NULL DEFAULT '[]'::jsonb
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_chat_conversations_started_at
  ON chat_conversations (started_at DESC)
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_chat_conversations_language
  ON chat_conversations (language)
`;

console.log("Migration complete: chat_conversations is ready.");
