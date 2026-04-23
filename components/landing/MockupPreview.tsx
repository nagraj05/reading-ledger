import { MockAuthorCard } from "./MockAuthorCard";

const MOCK_AUTHORS = [
  { name: "Haruki Murakami", genre: "Literary Fiction", years: "b. 1949", read: 5, total: 9 },
  { name: "Toni Morrison",   genre: "American Lit",    years: "1931–2019", read: 3, total: 7 },
  { name: "Elena Ferrante",  genre: "Contemporary",    years: "b. ~1943",  read: 2, total: 4 },
  { name: "Dostoevsky",      genre: "Russian Classic", years: "1821–1881", read: 4, total: 6 },
];

export function MockupPreview() {
  return (
    <div
      className="w-full border border-border bg-background overflow-hidden"
      style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)" }}
    >
      {/* Mini nav */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-surface">
        <div
          className="w-6 h-6 grid place-items-center font-serif italic text-sm bg-surface"
          style={{ border: "1.5px solid var(--ink)", borderRadius: "2px" }}
        >
          R
        </div>
        <span className="font-serif text-[13px] tracking-wide text-ink">Reading Ledger</span>
        <div className="ml-auto flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 rounded-full bg-surface-2 border border-border" style={{ width: i === 1 ? 48 : 32 }} />
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3 px-5 pt-4 pb-2">
        {[
          { label: "Books read", value: "14" },
          { label: "Authors",    value: "4"  },
          { label: "Genres",     value: "3"  },
        ].map(k => (
          <div key={k.label} className="bg-surface border border-border px-3 py-2.5" style={{ borderRadius: "var(--radius-md)" }}>
            <p className="text-[9px] uppercase tracking-widest text-ink-3 font-semibold">{k.label}</p>
            <p className="font-serif text-2xl text-ink leading-none mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Author grid */}
      <div className="grid grid-cols-4 gap-3 p-5 pt-3">
        {MOCK_AUTHORS.map(a => <MockAuthorCard key={a.name} {...a} />)}
      </div>
    </div>
  );
}
