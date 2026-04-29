import Link from "next/link";
import type { AuthorData } from "@/app/dashboard/page";

interface Props {
  author: AuthorData;
  readCount: number;
}

export function AuthorCard({ author, readCount }: Props) {
  const total = author.books.length;
  const pct = total ? (readCount / total) * 100 : 0;

  return (
    <Link
      href={`/dashboard/author/${author.id}`}
      className="author-card bg-surface border border-border p-5 flex flex-col gap-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-border-strong"
      style={{ borderRadius: "var(--radius-lg)", display: "flex" }}
    >
      <div className="bg-surface-2 overflow-hidden" style={{ aspectRatio: "4/5", borderRadius: "var(--radius-md)" }}>
        {author.image_url && (
          <img src={author.image_url} alt={author.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="font-serif text-[20px] leading-tight text-ink" style={{ letterSpacing: "-0.01em" }}>
          {author.name}
        </span>
        <span className="text-[12px] text-ink-3">{total} books tracked</span>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--accent)" }} />
        </div>
        <span className="text-[12px] text-ink-2 tabular-nums">{readCount}/{total}</span>
      </div>
    </Link>
  );
}
