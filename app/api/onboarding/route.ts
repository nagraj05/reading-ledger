import { auth } from "@clerk/nextjs/server";
import { sql, initTables, upsertUser, markUserOnboarded } from "@/lib/db";

interface Author {
  id: number;
  name: string;
  image_url?: string;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { authors }: { authors: Author[] } = await req.json();
  if (!authors?.length) return Response.json({ error: "No authors provided" }, { status: 400 });

  await initTables();
  await upsertUser(userId);

  await Promise.all(
    authors.map((a) =>
      sql`
        INSERT INTO user_authors (user_id, author_id, author_name, image_url)
        VALUES (${userId}, ${a.id}, ${a.name}, ${a.image_url ?? null})
        ON CONFLICT (user_id, author_id) DO NOTHING
      `
    )
  );

  await markUserOnboarded(userId);

  return Response.json({ ok: true });
}
