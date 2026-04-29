"use client";

import type { HCBook } from "@/lib/hardcover";

interface Props {
  book: HCBook;
  isRead: boolean;
  onToggle: () => void;
}

export function BookRow({ book, isRead, onToggle }: Props) {
  return (
    <div
      className="grid items-center gap-4 py-3 border-b border-border"
      style={{ gridTemplateColumns: "auto 48px 1fr auto" }}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={isRead ? "Mark unread" : "Mark read"}
        className="w-[22px] h-[22px] flex-shrink-0 grid place-items-center border-[1.5px] border-border-strong transition-all"
        style={{
          borderRadius: "5px",
          background: isRead ? "var(--accent)" : "var(--surface)",
          borderColor: isRead ? "var(--accent)" : undefined,
        }}
      >
        <svg
          width="13" height="13" viewBox="0 0 14 14" fill="none"
          style={{ opacity: isRead ? 1 : 0, transition: "opacity 0.15s", color: "var(--accent-ink)" }}
        >
          <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Cover */}
      <div
        className="bg-surface-2 overflow-hidden flex-shrink-0"
        style={{
          width: 48, aspectRatio: "2/3", borderRadius: "3px",
          boxShadow: "0 1px 3px rgba(26,22,19,.15), 0 6px 12px -6px rgba(26,22,19,.2)",
          opacity: isRead ? 0.5 : 1, transition: "opacity 0.2s",
        }}
      >
        {book.cover_url && (
          <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <div
          className="font-serif text-[18px] leading-snug text-ink"
          style={isRead ? { textDecoration: "line-through", textDecorationColor: "var(--strike)", color: "var(--ink-3)" } : undefined}
        >
          {book.title}
        </div>
        <div className="text-[12px] text-ink-3 mt-0.5">
          {book.series_order != null ? `Book ${book.series_order} · ` : ""}
          {book.year ?? ""}
        </div>
      </div>

      {/* Year */}
      <span className="text-[12px] text-ink-3 tabular-nums w-10 text-right">{book.year ?? ""}</span>
    </div>
  );
}
