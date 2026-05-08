import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Done-For-You EU AI Act audit — ActReady" },
      {
        name: "description",
        content:
          "Hands-on EU AI Act audit: manual technical review, remediation workshop, policy pack and audit-prep dossier. From $2,000 per engagement.",
      },
      { property: "og:title", content: "DFY EU AI Act audit" },
      {
        property: "og:description",
        content:
          "When procurement asks and you don't have time to build it yourself. Audit, workshop, policies, evidence — done in two weeks.",
      },
    ],
  }),
  component: AuditPage,
});

const deliverables = [
  {
    title: "Manual technical review",
    body:
      "An auditor reviews the agent's output, deepens it with code-level inspection, and validates classification against your real system architecture.",
  },
  {
    title: "Remediation workshop",
    body:
      "90 minutes with your engineering, product and compliance leads. Walk through every gap, prioritize, and assign ownership.",
  },
  {
    title: "Policy & governance pack",
    body:
      "Risk management policy, data governance procedure, human oversight playbook, incident logging template, model card template — all opinionated, all editable.",
  },
  {
    title: "Audit-prep dossier",
    body:
      "A consolidated evidence package designed to pass an enterprise security/AI questionnaire or a notified-body pre-check.",
  },
] as const;

function AuditPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Done-for-you
              </div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                We run the audit. You ship the evidence.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
                When an enterprise procurement team or a regulator's deadline lands on your roadmap,
                you don't need a slide deck. You need a defensible, technical, AI-Act-aligned audit
                package — fast.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-1 p-6">
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Engagement
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">$2,000–$5,000</div>
              <p className="mt-2 text-xs text-muted-foreground">
                Scoped per system. Typical turnaround: 10 working days.
              </p>
              <Link
                to="/contact"
                className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Book intake call
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">What you get</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {deliverables.map((d) => (
            <div key={d.title} className="rounded-xl border border-border bg-surface-1 p-6">
              <h3 className="text-base font-semibold">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">Not sure if you're high-risk?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with the free agent scan. It returns a classification you can sanity-check
                before booking.
              </p>
            </div>
            <Link
              to="/scan"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-surface-2"
            >
              Run free scan first
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
