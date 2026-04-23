interface Author {
  id: number;
  name: string;
  image?: { url: string };
  books_count?: number;
}

interface Props {
  author: Author;
  selected: boolean;
  onToggle: () => void;
}

export function AuthorPickCard({ author, selected, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="relative text-left flex flex-col gap-3 p-4 border-2 transition-all"
      style={{
        borderRadius: "var(--radius-lg)",
        background: selected ? "color-mix(in srgb, var(--accent) 8%, var(--surface))" : "var(--surface)",
        borderColor: selected ? "var(--accent)" : "var(--border)",
      }}
    >
      {/* Selected checkmark */}
      {selected && (
        <div
          className="absolute top-3 right-3 w-5 h-5 grid place-items-center"
          style={{ background: "var(--accent)", borderRadius: "50%" }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="var(--accent-ink)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Avatar */}
      <div
        className="w-full bg-surface-2 overflow-hidden"
        style={{ aspectRatio: "4/5", borderRadius: "var(--radius-md)" }}
      >
        {author.image?.url && (
          <img src={author.image.url} alt={author.name} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        <span className="font-serif text-[15px] leading-tight text-ink">{author.name}</span>
        {author.books_count != null && (
          <span className="text-[11px] text-ink-3">{author.books_count} books</span>
        )}
      </div>
    </button>
  );
}
