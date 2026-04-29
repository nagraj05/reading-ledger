import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export async function initTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      onboarded   BOOLEAN NOT NULL DEFAULT false,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS user_authors (
      id          SERIAL PRIMARY KEY,
      user_id     TEXT NOT NULL,
      author_id   INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      image_url   TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, author_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS read_books (
      id         SERIAL PRIMARY KEY,
      user_id    TEXT NOT NULL,
      book_id    INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, book_id)
    )
  `;
}

export async function upsertUser(userId: string) {
  await sql`
    INSERT INTO users (id) VALUES (${userId})
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function isUserOnboarded(userId: string): Promise<boolean> {
  const rows = await sql`SELECT onboarded FROM users WHERE id = ${userId}`;
  return rows.length > 0 && rows[0].onboarded === true;
}

export async function markUserOnboarded(userId: string) {
  await sql`UPDATE users SET onboarded = true WHERE id = ${userId}`;
}
