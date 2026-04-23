"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import type { HCBook } from "@/lib/hardcover";
import { BookRow } from "./BookRow";

interface Author {
  id: number;
  name: string;
  image_url: string | null;
  bio: string | null;
  born_year: number | null;
  death_year: number | null;
}

interface Props {
  author: Author;
  books: HCBook[];
  initialRead: number[];
}

type Filter = "all" | "unread" | "read";

export default function AuthorDetailPage({ author, books, initialRead }: Props) {
  const [readIds, setReadIds] = useState<Set<number>>(() => new Set(initialRead));
  const [filter, setFilter] = useState<Filter>("all");

  const years = author.born_year
    ? author.death_year
      ? `${author.born_year}–${author.death_year}`
      : `b. ${author.born_year}`
    : null;

  const total = books.length;
  const readCount = books.filter((b) => readIds.has(b.id)).length;
  const pct = total ? (readCount / total) * 100 : 0;

  const toggleRead = useCallback(async (bookId: number) => {
    const nowRead = !readIds.has(bookId);
    setReadIds((prev) => {
      const next = new Set(prev);
      nowRead ? next.add(bookId) : next.delete(bookId);
      return next;
    });
    await fetch("/api/books/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, read: nowRead }),
    });
  }, [readIds]);

  const visible = useMemo(() => {
    if (filter === "read") return books.filter((b) => readIds.has(b.id));
    if (filter === "unread") return books.filter((b) => !readIds.has(b.id));
    return books;
  }, [books, readIds, filter]);

  const { seriesGroups, standalone } = useMemo(() => {
    const map = new Map<string, HCBook[]>();
    const lone: HCBook[] = [];
    for (const b of visible) {
      if (b.series_name) {
        if (!map.has(b.series_name)) map.set(b.series_name, []);
        map.get(b.series_name)!.push(b);
      } else {
        lone.push(b);
      }
    }
    return {
      seriesGroups: [...map.entries()].map(([name, bks]) => ({ name, books: bks })),
      standalone: lone,
    };
  }, [visible]);

  const FILTERS: [Filter, string][] = [["all", "All"], ["unread", "Unread"], ["read", "Read"]];

  return (
    <main style={{ maxWidth: "1240px", margin: "0 auto", padding: "32px clamp(20px, 4vw, 56px) 80px" }}>
      {/* Back */}
      <Link href="/dashboard"
        className="inline-flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink transition-colors mb-6">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        All authors
      </Link>

      {/* Author hero */}
      <div className="grid gap-12 mb-12 pb-10 border-b border-border"
        style={{ gridTemplateColumns: "260px 1fr", alignItems: "start" }}>
        <div className="bg-surface-2 overflow-hidden" style={{ aspectRatio: "4/5", borderRadius: "var(--radius-lg)" }}>
          {author.image_url && (
            <img src={author.image_url} alt={author.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <h1 className="font-serif font-normal text-ink mb-3"
            style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.02em" }}>
            {author.name}
          </h1>
          {years && <p className="text-[13px] text-ink-3 mb-4">{years}</p>}
          {author.bio && (
            <p className="font-serif text-[18px] leading-relaxed text-ink-2 mb-6" style={{ maxWidth: "60ch" }}>
              {author.bio}
            </p>
          )}
          <div className="flex items-center gap-5">
            <div>
              <span className="font-serif text-[34px] leading-none">{readCount}</span>
              <span className="text-ink-3 text-[22px] font-serif">/{total}</span>
              <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-semibold mt-1">Read</p>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--accent)" }} />
              </div>
              <p className="text-[11px] text-ink-3 mt-2">{Math.round(pct)}% of the shelf</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className="px-4 py-1.5 rounded-full text-[13px] border-2 transition-all"
            style={filter === val
              ? { borderColor: "var(--accent)", color: "var(--accent)", fontWeight: 500 }
              : { borderColor: "var(--border)", color: "var(--ink-2)" }}>
            {label}
            <span className="ml-1.5 text-[11px] opacity-60">
              {val === "all" ? total : val === "read" ? readCount : total - readCount}
            </span>
          </button>
        ))}
      </div>

      {/* Book list */}
      {visible.length === 0 ? (
        <p className="text-center py-16 text-ink-3 font-serif italic">Nothing here under this filter.</p>
      ) : (
        <>
          {seriesGroups.map((g) => (
            <div key={g.name} className="mb-7">
              <div className="flex items-baseline justify-between pb-2.5 mb-1 border-b border-border">
                <span className="font-serif text-[22px] italic">{g.name}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
                  {g.books.filter((b) => readIds.has(b.id)).length}/{g.books.length} read
                </span>
              </div>
              {g.books.map((b) => (
                <BookRow key={b.id} book={b} isRead={readIds.has(b.id)} onToggle={() => toggleRead(b.id)} />
              ))}
            </div>
          ))}

          {standalone.length > 0 && (
            <div className="mb-7">
              <div className="flex items-baseline justify-between pb-2.5 mb-1 border-b border-border">
                <span className="font-serif text-[22px] italic">Standalone</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
                  {standalone.filter((b) => readIds.has(b.id)).length}/{standalone.length} read
                </span>
              </div>
              {standalone.map((b) => (
                <BookRow key={b.id} book={b} isRead={readIds.has(b.id)} onToggle={() => toggleRead(b.id)} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
