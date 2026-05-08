import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CTA({ title, sub }: { title?: string; sub?: string }) {
  return (
    <section className="border-y border-border bg-surface-1">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {title ?? "Do the hard part before the hard part shows up."}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {sub ??
                "Run a readiness scan now and see what is missing before procurement, legal, or an enterprise buyer forces the conversation."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Run free readiness scan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-surface-2"
            >
              Book DFY audit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
