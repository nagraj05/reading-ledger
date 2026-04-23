import { KpiRing } from "./KpiRing";

interface Props {
  label: string;
  value: number;
  note: string;
  pct: number;
}

export function KpiCard({ label, value, note, pct }: Props) {
  return (
    <div className="bg-surface border border-border p-5 flex flex-col gap-3 shadow-sm kpi-card" style={{ borderRadius: "var(--radius-lg)" }}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">{label}</span>
        <div className="relative flex-shrink-0">
          <KpiRing pct={pct} />
          <span className="absolute inset-0 grid place-items-center font-serif text-[12px] text-ink">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div className="font-serif text-[44px] leading-none font-normal" style={{ letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div className="text-[12px] text-ink-3">{note}</div>
    </div>
  );
}
