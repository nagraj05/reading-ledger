export function KpiRing({ pct }: { pct: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;

  return (
    <svg width="54" height="54" viewBox="0 0 54 54">
      <circle cx="27" cy="27" r={r} fill="none" stroke="var(--border)" strokeWidth="3.5" />
      <circle
        cx="27" cy="27" r={r} fill="none"
        stroke="var(--accent)" strokeWidth="3.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 27 27)"
      />
    </svg>
  );
}
