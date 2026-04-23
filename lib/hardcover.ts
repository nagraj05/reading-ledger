const GQL = "https://api.hardcover.app/v1/graphql";

async function hcQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(GQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HARDCOVER_API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  if (json.errors) console.error("[Hardcover]", json.errors[0]?.message);
  return json.data;
}

function imageUrl(cached: unknown): string | null {
  if (!cached) return null;
  const obj = (typeof cached === "string" ? JSON.parse(cached) : cached) as Record<string, unknown>;
  return (obj?.url as string) ?? null;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HCBook {
  id: number;
  title: string;
  year: number | null;
  cover_url: string | null;
  series_name: string | null;
  series_order: number | null;
}

export interface HCAuthor {
  id: number;
  name: string;
  bio: string | null;
  born_year: number | null;
  death_year: number | null;
  image_url: string | null;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

const BOOKS_QUERY = `
  query AuthorBooks($authorId: Int!) {
    books(
      where: { contributions: { author: { id: { _eq: $authorId } } } }
      order_by: [{ users_count: desc_nulls_last }, { release_year: asc_nulls_last }]
      limit: 100
    ) {
      id
      title
      release_year
      cached_image
    }
  }
`;

const AUTHOR_QUERY = `
  query AuthorDetails($authorId: Int!) {
    authors_by_pk(id: $authorId) {
      id
      name
      bio
      born_year
      death_year
      cached_image
    }
  }
`;

// ─── Exports ─────────────────────────────────────────────────────────────────

export async function fetchAuthorBooks(authorId: number): Promise<HCBook[]> {
  try {
    const data = await hcQuery<{ books: Record<string, unknown>[] }>(BOOKS_QUERY, { authorId });
    return (data?.books ?? []).map((b) => ({
      id: b.id as number,
      title: b.title as string,
      year: (b.release_year as number) ?? null,
      cover_url: imageUrl(b.cached_image),
      series_name: null,
      series_order: null,
    }));
  } catch (e) {
    console.error("[Hardcover] fetchAuthorBooks failed", e);
    return [];
  }
}

export async function fetchAuthorDetails(authorId: number): Promise<HCAuthor | null> {
  try {
    const data = await hcQuery<{ authors_by_pk: Record<string, unknown> | null }>(AUTHOR_QUERY, { authorId });
    const a = data?.authors_by_pk;
    if (!a) return null;
    return {
      id: a.id as number,
      name: a.name as string,
      bio: (a.bio as string) ?? null,
      born_year: (a.born_year as number) ?? null,
      death_year: (a.death_year as number) ?? null,
      image_url: imageUrl(a.cached_image),
    };
  } catch (e) {
    return null;
  }
}
