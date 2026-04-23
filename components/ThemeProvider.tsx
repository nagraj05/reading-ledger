"use client";

import { createContext, useContext, useState } from "react";

export type AccentKey = "terracotta" | "oxblood" | "forest" | "ink" | "indigo" | "ochre";
export type PairingKey = "fraunces-inter" | "playfair-karla" | "ebgaramond-work" | "crimson-dmsans";
export type Density = "spacious" | "compact";

export interface Tweaks {
  theme: "light" | "dark";
  accent: AccentKey;
  fontPairing: PairingKey;
  density: Density;
  showKpis: boolean;
  surprise: boolean;
}

export const ACCENT_MAP: Record<AccentKey, { name: string; color: string; ink: string }> = {
  terracotta: { name: "Terracotta", color: "#b66b4a", ink: "#ffffff" },
  oxblood:    { name: "Oxblood",    color: "#7a2e2e", ink: "#ffffff" },
  forest:     { name: "Forest",     color: "#3a5a3a", ink: "#ffffff" },
  ink:        { name: "Ink",        color: "#1a1613", ink: "#faf7f2" },
  indigo:     { name: "Indigo",     color: "#3a4a7a", ink: "#ffffff" },
  ochre:      { name: "Ochre",      color: "#b58a3a", ink: "#ffffff" },
};

export const FONT_PAIRINGS: Record<PairingKey, { name: string; label: string }> = {
  "fraunces-inter":  { name: "Fraunces / Inter",   label: "Fraunces" },
  "playfair-karla":  { name: "Playfair / Karla",   label: "Playfair" },
  "ebgaramond-work": { name: "Garamond / Work",    label: "Garamond" },
  "crimson-dmsans":  { name: "Crimson / DM Sans",  label: "Crimson"  },
};

const DEFAULTS: Tweaks = {
  theme: "light",
  accent: "terracotta",
  fontPairing: "fraunces-inter",
  density: "spacious",
  showKpis: true,
  surprise: false,
};

interface ThemeContextValue {
  tweaks: Tweaks;
  update: (patch: Partial<Tweaks>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function load(): Tweaks {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem("rl-tweaks");
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function applyToDOM(t: Tweaks) {
  const el = document.documentElement;
  el.dataset.theme = t.theme;
  el.dataset.pairing = t.fontPairing;
  el.dataset.surprise = t.surprise ? "on" : "off";
  const accent = ACCENT_MAP[t.accent];
  el.style.setProperty("--accent", accent.color);
  el.style.setProperty("--accent-ink", accent.ink);
  el.style.setProperty("--density", t.density === "compact" ? "0.7" : "1");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(load);

  function update(patch: Partial<Tweaks>) {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    applyToDOM(next);
    localStorage.setItem("rl-tweaks", JSON.stringify(next));
  }

  return (
    <ThemeContext.Provider value={{ tweaks, update }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
