"use client";

import { useEffect, useRef } from "react";
import {
  useTheme,
  ACCENT_MAP,
  FONT_PAIRINGS,
  type AccentKey,
  type PairingKey,
} from "@/components/ThemeProvider";

const PAIRING_FONT_VAR: Record<PairingKey, string> = {
  "fraunces-inter":  "var(--font-fraunces)",
  "playfair-karla":  "var(--font-playfair)",
  "ebgaramond-work": "var(--font-garamond)",
  "crimson-dmsans":  "var(--font-crimson)",
};

export function TweaksPanel({ onClose }: { onClose: () => void }) {
  const { tweaks, update } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Tweaks"
      className="absolute right-0 top-full mt-2 w-72 z-50 border border-border-strong bg-surface overflow-hidden"
      style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-serif italic text-[15px] text-ink">Tweaks</span>
        <button
          onClick={onClose}
          aria-label="Close tweaks"
          className="w-7 h-7 rounded-full grid place-items-center text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4 max-h-[70vh] overflow-y-auto">

        {/* Theme */}
        <Row label="Theme" current={tweaks.theme === "light" ? "Light" : "Dark"}>
          <div className="flex gap-1.5">
            {([
              { value: "light", label: "Light", icon: <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { value: "dark",  label: "Dark",  icon: <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M17 12A7 7 0 1 1 8 3a5 5 0 0 0 9 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
            ] as const).map(({ value, label, icon }) => {
              const active = tweaks.theme === value;
              return (
                <button
                  key={value}
                  onClick={() => update({ theme: value })}
                  className="inline-flex items-center gap-1.5 px-3! py-0.5! rounded-full text-[12px] font-medium transition-all"
                  style={
                    active
                      ? { background: "var(--accent)", color: "var(--accent-ink, #fff)", boxShadow: "0 1px 4px color-mix(in srgb, var(--accent) 40%, transparent)" }
                      : { background: "var(--surface-2)", color: "var(--ink-2)", border: "1px solid var(--border)" }
                  }
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>
        </Row>

        {/* Accent */}
        <Row label="Accent" current={ACCENT_MAP[tweaks.accent].name}>
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(ACCENT_MAP) as [AccentKey, (typeof ACCENT_MAP)[AccentKey]][]).map(([k, v]) => (
              <button
                key={k}
                title={v.name}
                onClick={() => update({ accent: k })}
                className="w-7 h-7 rounded-full transition-all hover:scale-110 flex items-center justify-center"
                style={{
                  background: v.color,
                  boxShadow: tweaks.accent === k
                    ? `0 0 0 2px var(--surface), 0 0 0 4px ${v.color}`
                    : "none",
                }}
              >
                {tweaks.accent === k && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={v.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </Row>

        {/* Font Pairing */}
        <Row label="Font" current={FONT_PAIRINGS[tweaks.fontPairing].name}>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.entries(FONT_PAIRINGS) as [PairingKey, (typeof FONT_PAIRINGS)[PairingKey]][]).map(([k, v]) => {
              const active = tweaks.fontPairing === k;
              return (
                <button
                  key={k}
                  onClick={() => update({ fontPairing: k })}
                  className="inline-flex items-center gap-1.5 px-3! py-0.5! rounded-full text-[12px] font-medium transition-all"
                  style={
                    active
                      ? { background: "var(--accent)", color: "var(--accent-ink, #fff)", fontFamily: PAIRING_FONT_VAR[k], boxShadow: "0 1px 4px color-mix(in srgb, var(--accent) 40%, transparent)" }
                      : { background: "var(--surface-2)", color: "var(--ink-2)", fontFamily: PAIRING_FONT_VAR[k], border: "1px solid var(--border)" }
                  }
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </Row>

        {/* Density */}
        <Row label="Density" current={tweaks.density === "spacious" ? "Spacious" : "Compact"}>
          <div className="flex gap-1.5">
            {([
              { value: "spacious", label: "Spacious" },
              { value: "compact",  label: "Compact"  },
            ] as const).map(({ value, label }) => {
              const active = tweaks.density === value;
              return (
                <button
                  key={value}
                  onClick={() => update({ density: value })}
                  className="inline-flex items-center gap-1.5 px-3! py-0.5! rounded-full text-[12px] font-medium transition-all"
                  style={
                    active
                      ? { background: "var(--accent)", color: "var(--accent-ink, #fff)", boxShadow: "0 1px 4px color-mix(in srgb, var(--accent) 40%, transparent)" }
                      : { background: "var(--surface-2)", color: "var(--ink-2)", border: "1px solid var(--border)" }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Row>

        {/* Toggles */}
        <div className="flex flex-col gap-3 pt-1 border-t border-border">
          <Toggle label="Show KPIs" on={tweaks.showKpis} onToggle={() => update({ showKpis: !tweaks.showKpis })} />
          <Toggle label="Surprise me ✦" on={tweaks.surprise} onToggle={() => update({ surprise: !tweaks.surprise })} />
        </div>

      </div>
    </div>
  );
}

function Row({
  label,
  current,
  children,
}: {
  label: string;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">{label}</span>
        <span className="text-[11px] text-ink-2">{current}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}



function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between text-[13px] text-ink-2">
      <span>{label}</span>
      <button
        onClick={onToggle}
        aria-label={`Toggle ${label}`}
        className="relative w-8 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ background: on ? "var(--accent)" : "var(--border-strong)" }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "translate-x-3" : ""}`}
        />
      </button>
    </div>
  );
}