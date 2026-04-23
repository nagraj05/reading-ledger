import { NextRequest } from "next/server";

const HARDCOVER_GQL = "https://api.hardcover.app/v1/graphql";

const SEARCH_QUERY = `
  query SearchAuthors($query: String!, $per_page: Int!) {
    search(query: $query, query_type: "Author", per_page: $per_page) {
      results
    }
  }
`;

interface HardcoverDocument {
  id: string;
  name: string;
  books_count: number;
  image?: { url?: string };
  slug?: string;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return Response.json({ authors: [] });

  const res = await fetch(HARDCOVER_GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HARDCOVER_API_TOKEN}`,
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: { query: q, per_page: 12 },
    }),
  });

  const json = await res.json();
  const hits: { document: HardcoverDocument }[] =
    json.data?.search?.results?.hits ?? [];

  const authors = hits.map(({ document: d }) => ({
    id: Number(d.id),
    name: d.name,
    books_count: d.books_count,
    image: d.image?.url ? { url: d.image.url } : null,
    slug: d.slug,
  }));

  return Response.json({ authors });
}
