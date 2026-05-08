import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ActReady SaaS and Done-For-You audit" },
      {
        name: "description",
        content:
          "Two ways to get EU AI Act ready: $299/month SaaS for continuous scans, or a $2,000–$5,000 done-for-you audit with workshop and policy pack.",
      },
      { property: "og:title", content: "ActReady pricing" },
      {
        property: "og:description",
        content:
          "SaaS from $299/mo. DFY audit from $2,000. Pick the level of hand-holding your team needs.",
      },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "SaaS",
    price: "$299",
    cadence: "per month",
    blurb: "Continuous scans, dashboards and exports for one product or repo.",
    cta: "Join waitlist",
    href: "/contact" as const,
    features: [
      "Unlimited automated repo & docs scans",
      "Readiness score history & trend",
      "Gap analysis mapped to AI Act articles",
      "Evidence checklist & exportable report",
      "Email alerts when controls regress",
      "1 workspace, up to 5 seats",
    ],
    featured: false,
  },
  {
    name: "DFY Audit",
    price: "$2,000–$5,000",
    cadence: "per engagement",
    blurb:
      "Manual expert review on top of the agent, plus a remediation workshop and policy pack.",
    cta: "Book DFY audit",
    href: "/audit" as const,
    features: [
      "Everything in SaaS",
      "Manual technical review by an auditor",
      "1.5h remediation workshop with your team",
      "AI Act policy & governance pack (templates)",
      "Audit-prep dossier for enterprise procurement",
      "Optional pre-conformity assessment review",
    ],
    featured: true,
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
            Two ways to get audit-ready.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Run the agent yourself on a SaaS plan, or hand it to us for a done-for-you audit when
            procurement is breathing down your neck.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl border p-7 ${
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
