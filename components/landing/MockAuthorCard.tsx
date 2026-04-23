interface MockAuthorCardProps {
  name: string;
  genre: string;
  years: string;
  read: number;
  total: number;
}

export function MockAuthorCard({ name, genre, years, read, total }: MockAuthorCardProps) {
  const pct = Math.round((read / total) * 100);
  return (
    <div className="bg-surface border border-border p-4 flex flex-col gap-3" style={{ borderRadius: "var(--radius-lg)" }}>
      <div
        className="bg-surface-2"
        style={{ aspectRatio: "4/5", borderRadius: "var(--radius-md)" }}
      />
      <div className="flex flex-col gap-0.5">
        <span className="font-serif text-[15px] leading-tight text-ink">{name}</span>
        <span className="text-[11px] text-ink-3">{years}</span>
        <span className="text-[10px] uppercase tracking-wide text-ink-3 mt-0.5">{genre}</span>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
        </div>
        <span className="text-[11px] text-ink-3 tabular-nums">{read}/{total}</span>
      </div>
    </div>
  );
}
