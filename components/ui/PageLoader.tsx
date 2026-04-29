export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="2.5" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="text-[13px] text-ink-3 font-serif italic">{label}</span>
    </div>
  );
}
