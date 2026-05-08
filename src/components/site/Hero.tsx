import { Link } from "@tanstack/react-router";
import { ArrowRight, GitBranch } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            High-risk AI obligations apply from 2 Aug 2026
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            See what procurement, auditors, and enterprise buyers will ask for{" "}
            <span className="text-primary">before they ask for it.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
            ActReady scans your repo, technical docs, and AI workflows to assess EU AI Act
            readiness, surface evidence gaps, and generate a structured remediation plan for
            engineering and compliance teams.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Built for CTOs, Heads of AI, and VP Engineering — not for compliance theater.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <GitBranch className="h-4 w-4" />
              Run free readiness scan
            </Link>
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-1 px-4 py-2.5 text-sm font-medium hover:bg-surface-2"
            >
              Book DFY audit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Public repo or architecture summary only for the free scan. Private systems go through a
            guided audit flow.
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-6xl">
          <div className="rounded-xl border border-border bg-surface-1 p-1.5 shadow-[0_0_0_1px_oklch(1_0_0/4%)]">
            <img
              src={heroDashboard}
              alt="ActReady readiness dashboard showing EU AI Act evidence gaps and remediation plan"
              width={1536}
              height={1024}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
