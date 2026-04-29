"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { AuthorData } from "@/app/dashboard/page";
import { KpiCard } from "./KpiCard";
import { AuthorCard } from "./AuthorCard";

interface Props {
  authors: AuthorData[];
  initialRead: number[];
}

export default function HomePage({ authors, initialRead }: Props) {
  const [query, setQuery] = useState("");
  const readSet = useMemo(() => new Set(initialRead), [initialRead]);

  const kpis = useMemo(() => {
    let totalBooks = 0, booksRead = 0;
    for (const a of authors) {
      totalBooks += a.books.length;
      booksRead += a.books.filter((b) => readSet.has(b.id)).length;
    }
    const authorsExplored = authors.filter((a) => a.books.some((b) => readSet.has(b.id))).length;
    return { totalBooks, booksRead, authorsExplored, totalAuthors: authors.length };
  }, [authors, readSet]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return authors;
    return authors.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.books.some((b) => b.title.toLowerCase().includes(q))
    );
  }, [query, authors]);

  return (
    <main style={{ maxWidth: "1240px", margin: "0 auto", padding: "40px clamp(20px, 4vw, 56px) 80px" }}>
      {/* Hero */}
      <div className="grid gap-14 mb-12" style={{ gridTemplateColumns: "1.2fr 1fr", alignItems: "end" }}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-ink-3 font-semibold mb-5">
            A personal reading ledger · 2026
          </p>
          <h1 className="font-serif font-normal text-ink mb-4"
            style={{ fontSize: "clamp(44px, 6vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.02em" }}>
            The books I mean<br />to finish, <em style={{ color: "var(--accent)" }}>eventually</em>.
          </h1>
          <p className="text-ink-2 text-[15px]" style={{ maxWidth: "46ch" }}>
            An unhurried shelf of authors worth returning to. Check a book off when it&apos;s done.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Books read" value={kpis.booksRead}
              note={`of ${kpis.totalBooks} tracked`}
              pct={kpis.totalBooks ? (kpis.booksRead / kpis.totalBooks) * 100 : 0} />
            <KpiCard label="Authors" value={kpis.authorsExplored}
              note={`of ${kpis.totalAuthors} on shelf`}
              pct={kpis.totalAuthors ? (kpis.authorsExplored / kpis.totalAuthors) * 100 : 0} />
            <KpiCard label="Completion" value={Math.round(kpis.totalBooks ? (kpis.booksRead / kpis.totalBooks) * 100 : 0)}
              note="percent overall" pct={kpis.totalBooks ? (kpis.booksRead / kpis.totalBooks) * 100 : 0} />
          </div>
        </div>
      </div>

      {/* Search row */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
        <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 border border-border bg-surface transition-colors focus-within:border-ink"
          style={{ borderRadius: "var(--radius-md)" }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-ink-3 flex-shrink-0">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search authors or titles…" value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[15px] text-ink placeholder:text-ink-3" />
          {query && (
            <button onClick={() => setQuery("")} className="text-ink-3 hover:text-ink">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
        <span className="text-[12px] text-ink-3 whitespace-nowrap">
          {filtered.length} {filtered.length === 1 ? "author" : "authors"}
        </span>
        <Link href="/onboarding"
          className="px-3.5 py-1.5 rounded-full border border-border-strong text-[13px] text-ink-2 hover:border-ink hover:text-ink transition-all">
          + Add authors
        </Link>
      </div>

      {/* Author grid */}
      {filtered.length === 0 ? (
        <p className="text-center py-20 text-ink-3 font-serif italic text-lg">
          Nothing on the shelves matches &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {filtered.map((a) => (
            <AuthorCard key={a.id} author={a} readCount={a.books.filter((b) => readSet.has(b.id)).length} />
          ))}
        </div>
      )}
    </main>
  );
}
