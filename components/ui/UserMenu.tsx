"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="User menu"
        className="w-8 h-8 rounded-full border border-border-strong bg-surface-2 grid place-items-center text-ink-2 hover:border-ink hover:text-ink transition-colors overflow-hidden"
      >
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44 bg-surface border border-border-strong overflow-hidden z-50"
          style={{ borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-card)" }}
        >
          {user?.firstName && (
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-[13px] font-medium text-ink truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[11px] text-ink-3 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          )}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-ink-2 hover:bg-surface-2 hover:text-ink transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-danger hover:bg-surface-2 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
