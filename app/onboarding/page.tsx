"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthorPickCard } from "@/components/onboarding/AuthorPickCard";

interface Author {
  id: number;
  name: string;
  image?: { url: string };
  books_count?: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Author[]>([]);
  const [selected, setSelected] = useState<Map<number, Author>>(new Map());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const res = await fetch(`/api/authors/search?q=${encodeURIComponent(q)}`);
    const { authors } = await res.json();
    setResults(authors);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 400);
    return () => clearTimeout(t);
  }, [query, search]);

  function toggle(author: Author) {
    setSelected(prev => {
      const next = new Map(prev);
      next.has(author.id) ? next.delete(author.id) : next.set(author.id, author);
      return next;
    });
  }

  async function submit() {
    if (!selected.size) return;
    setSaving(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authors: [...selected.values()].map(a => ({
          id: a.id,
          name: a.name,
          image_url: a.image?.url,
        })),
      }),
    });
    router.push("/dashboard");
  }

  return (
    <main className="flex-1 flex flex-col" style={{ maxWidth: "900px", margin: "0 auto", padding: "48px clamp(20px, 4vw, 48px) 120px" }}>

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink-3 font-semibold mb-3">Step 1 of 1</p>
        <h1 className="font-serif font-normal text-ink mb-2" style={{ fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.02em" }}>
          Who do you read?
        </h1>
        <p className="text-ink-2 text-[15px]">Search for authors you want to track. You can always add more later.</p>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-3 px-4 py-3 mb-6 border border-border bg-surface transition-colors focus-within:border-ink"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-ink-3 flex-shrink-0">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search authors…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[15px] text-ink placeholder:text-ink-3"
          autoFocus
        />
        {loading && (
          <svg className="animate-spin text-ink-3" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12"/>
          </svg>
        )}
        {query && !loading && (
          <button onClick={() => setQuery("")} className="text-ink-3 hover:text-ink transition-colors">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
          {results.map(a => (
            <AuthorPickCard key={a.id} author={a} selected={selected.has(a.id)} onToggle={() => toggle(a)} />
          ))}
        </div>
      ) : query && !loading ? (
        <p className="text-center text-ink-3 font-serif italic text-lg py-16">No authors found for &ldquo;{query}&rdquo;</p>
      ) : !query ? (
        <p className="text-center text-ink-3 text-[14px] py-16">Start typing to find your favourite authors</p>
      ) : null}

      {/* Sticky footer */}
      {selected.size > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-border bg-surface"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <span className="text-[14px] text-ink-2">
            <span className="font-serif text-xl text-ink mr-1">{selected.size}</span>
            {selected.size === 1 ? "author" : "authors"} selected
          </span>
          <button
            onClick={submit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-[14px] font-medium transition-all disabled:opacity-60"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: "var(--radius-md)" }}
          >
            {saving ? "Saving…" : "Build my shelf →"}
          </button>
        </div>
      )}
    </main>
  );
}
