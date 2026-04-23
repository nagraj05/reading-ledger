import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { fetchAuthorBooks, fetchAuthorDetails } from "@/lib/hardcover";
import AuthorDetailPage from "@/components/dashboard/AuthorDetailPage";

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { id } = await params;
  const authorId = Number(id);

  const rows = (await sql`
    SELECT author_name, image_url FROM user_authors
    WHERE user_id = ${userId} AND author_id = ${authorId} LIMIT 1
  `) as { author_name: string; image_url: string | null }[];

  if (!rows[0]) redirect("/dashboard");

  const [details, books, readRows] = await Promise.all([
    fetchAuthorDetails(authorId),
    fetchAuthorBooks(authorId),
    sql`SELECT book_id FROM read_books WHERE user_id = ${userId}`,
  ]);

  const readSet = new Set((readRows as { book_id: number }[]).map((r) => r.book_id));

  return (
    <AuthorDetailPage
      author={{
        id: authorId,
        name: rows[0].author_name,
        image_url: details?.image_url ?? rows[0].image_url,
        bio: details?.bio ?? null,
        born_year: details?.born_year ?? null,
        death_year: details?.death_year ?? null,
      }}
      books={books}
      initialRead={[...readSet]}
    />
  );
}
