import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { sql, initTables } from "@/lib/db";
import { fetchAuthorBooks, type HCBook } from "@/lib/hardcover";
import HomePage from "@/components/dashboard/HomePage";

export interface AuthorData {
  id: number;
  name: string;
  image_url: string | null;
  books: HCBook[];
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  await initTables();

  const authorRows = (await sql`
    SELECT author_id, author_name, image_url FROM user_authors
    WHERE user_id = ${userId} ORDER BY created_at ASC
  `) as { author_id: number; author_name: string; image_url: string | null }[];

  if (authorRows.length === 0) redirect("/onboarding");

  const readRows = (await sql`
    SELECT book_id FROM read_books WHERE user_id = ${userId}
  `) as { book_id: number }[];

  const readSet = new Set(readRows.map((r) => r.book_id));

  const authors: AuthorData[] = await Promise.all(
    authorRows.map(async (row) => ({
      id: row.author_id,
      name: row.author_name,
      image_url: row.image_url,
      books: await fetchAuthorBooks(row.author_id),
    }))
  );

  return <HomePage authors={authors} initialRead={[...readSet]} />;
}
