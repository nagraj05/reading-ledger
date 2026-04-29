import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { bookId, read }: { bookId: number; read: boolean } = await req.json();

  if (read) {
    await sql`
      INSERT INTO read_books (user_id, book_id)
      VALUES (${userId}, ${bookId})
      ON CONFLICT (user_id, book_id) DO NOTHING
    `;
  } else {
    await sql`DELETE FROM read_books WHERE user_id = ${userId} AND book_id = ${bookId}`;
  }

  return Response.json({ ok: true });
}
