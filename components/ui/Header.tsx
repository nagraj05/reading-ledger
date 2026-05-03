"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { TweaksPanel } from "@/components/ui/TweaksPanel";
import { UserMenu } from "@/components/ui/UserMenu";
import { SlidersHorizontal } from 'lucide-react';
import { Button } from "./button";


export default function Header() {
  const [showTweaks, setShowTweaks] = useState(false);
  const { isSignedIn } = useUser();
  const { openSignIn, openSignUp } = useClerk();

  return (
    <header className="border-b border-border bg-surface">
      <div
        className="mx-auto flex items-center justify-between h-14"
        style={{ maxWidth: "1240px", padding: "0 clamp(20px, 4vw, 56px)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 grid place-items-center font-serif italic text-xl bg-surface"
            style={{ border: "1.5px solid var(--ink)", borderRadius: "2px" }}
          >
            R
          </div>
          <div>
            <div className="font-serif text-[18px] tracking-wide leading-none">Reading Ledger</div>
            <div className="text-[10px] text-ink-3 uppercase tracking-[0.12em] mt-0.5">a books todo</div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative flex items-center gap-2">
          {/* Tweaks */}
          <button
            onClick={() => setShowTweaks(v => !v)}
            aria-pressed={showTweaks}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[13px] transition-all ${
              showTweaks
                ? "bg-ink text-background border-ink"
                : "bg-surface text-ink-2 border-border-strong hover:border-ink hover:text-ink"
            }`}
          >
            <SlidersHorizontal size={14} />
          </button>

          {showTweaks && <TweaksPanel onClose={() => setShowTweaks(false)} />}

          {/* Auth */}
          {isSignedIn ? (
            <UserMenu />
          ) : (
            <>
             <Button onClick={() => openSignIn()} variant="default" size="sm">
              Sign in
             </Button>
              <button
                onClick={() => openSignUp()}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
