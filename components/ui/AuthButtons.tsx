"use client";

import { useClerk } from "@clerk/nextjs";

export function AuthButtons() {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => openSignUp()}
        className="px-5 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-80"
        style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: "var(--radius-md)" }}
      >
        Get started
      </button>
      <button
        onClick={() => openSignIn()}
        className="px-5 py-2.5 text-[14px] text-ink-2 border border-border-strong transition-all hover:border-ink hover:text-ink"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        Sign in
      </button>
    </div>
  );
}
