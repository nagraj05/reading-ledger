import { AuthButtons } from "@/components/ui/AuthButtons";
import { MockupPreview } from "./MockupPreview";

export default function LandingPage() {
  return (
    <main className="flex-1" style={{ maxWidth: "1240px", margin: "0 auto", padding: "48px clamp(20px, 4vw, 56px) 80px" }}>

      {/* Hero */}
      <section className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink-3 font-semibold mb-5">
          A personal reading ledger · 2026
        </p>
        <h1
          className="font-serif font-normal text-ink mb-5"
          style={{ fontSize: "clamp(44px, 6vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.02em" }}
        >
          The books I mean<br />
          to finish, <em style={{ color: "var(--accent)" }}>eventually</em>.
        </h1>
        <p className="text-ink-2 text-[15px] mb-8" style={{ maxWidth: "46ch" }}>
          An unhurried shelf of authors worth returning to. Check a book off when it&apos;s done; mark a favourite when it refuses to leave you.
        </p>

        <AuthButtons />
      </section>

      {/* App preview */}
      <MockupPreview />

    </main>
  );
}
