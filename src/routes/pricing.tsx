import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ActReady readiness scans, Pro, and DFY audit" },
      {
        name: "description",
        content:
          "Free readiness scan, Pro at $299/month for ongoing tracking, or a $2,000–$5,000 done-for-you audit when procurement is breathing down your neck.",
      },
      { property: "og:title", content: "ActReady pricing" },
      {
        property: "og:description",
        content:
          "Free scan. Pro from $299/mo. DFY audit from $2,000. Pick the level of support your team needs.",
      },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Free scan",
    price: "$0",
    cadence: "one-off",
    blurb: "A lightweight readiness pass for public repo inputs or architecture summaries.",
    cta: "Run free readiness scan",
    href: "/scan" as const,
    features: [
      "Initial readiness score",
      "Likely exposure snapshot",
      "Top missing controls",
      "Top missing evidence",
      "Upgrade path to full audit",
    ],
    featured: false,
  },
  {
    name: "Pro",
    price: "$299",
    cadence: "per month",
    blurb:
      "Ongoing readiness tracking and structured evidence management for teams shipping AI features.",
    cta: "Start Pro",
    href: "/contact" as const,
    features: [
      "Recurring scans",
      "Evidence gap tracking",
      "Report history",
      "Team-ready exports",
      "Priority remediation views",
    ],
    featured: true,
  },
  {
    name: "DFY audit",
    price: "$2,000–$5,000",
    cadence: "per engagement",
    blurb:
      "Hands-on audit readiness support for teams facing procurement, customer diligence, or internal governance deadlines.",
    cta: "Book DFY audit",
    href: "/audit" as const,
    features: [
      "Guided review",
      "Deep evidence mapping",
      "Remediation workshop",
      "Documentation plan",
      "Audit and procurement prep",
    ],
    featured: false,
  },
] as const;

function PricingPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 md:py-24">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Pricing
          </div>
          <h1 className="mx-auto mt-3 max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Three ways to get audit-ready.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Start with a free scan. Track readiness on Pro. Hand it to us when procurement is
            breathing down your neck.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-xl border p-7 ${
                t.featured
                  ? "border-primary/40 bg-surface-2 ring-1 ring-primary/20"
                  : "border-border bg-surface-1"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-semibold">{t.name}</h3>
                {t.featured && (
                  <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    Most teams pick this
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.cadence}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{t.blurb}</p>
              <Link
                to={t.href}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-opacity ${
                  t.featured
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-background hover:bg-surface-2"
                }`}
              >
                {t.cta}
              </Link>
              <ul className="mt-7 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Not sure which fits? Run the free scan first — it shapes the conversation either way.
        </p>
      </section>
    </SiteLayout>
  );
}
