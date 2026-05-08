import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { CTA } from "@/components/site/CTA";
import { InvestorScore } from "@/components/site/InvestorScore";
import { ShieldCheck, AlertTriangle, FileSearch, Workflow } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ActReady — EU AI Act compliance audit agent for engineering teams" },
      {
        name: "description",
        content:
          "ActReady scans your repo and docs to produce an EU AI Act gap analysis, remediation roadmap and audit-ready evidence package. Built for CTOs and Heads of AI.",
      },
      { property: "og:title", content: "ActReady — EU AI Act compliance, developer-first" },
      {
        property: "og:description",
        content:
          "Audit your AI system against the EU AI Act in 5 minutes. Free repo scan, then DFY audit when procurement comes calling.",
      },
    ],
  }),
  component: Index,
});

const buyMotives = [
  {
    icon: AlertTriangle,
    title: "Avoid enforcement risk",
    body:
      "High-risk AI obligations carry material sanctions. Know where you stand before a regulator or notified body decides for you.",
  },
  {
    icon: ShieldCheck,
    title: "Win enterprise procurement",
    body:
      "RFPs increasingly demand audit trails, model documentation and human-oversight playbooks. Show evidence — not intentions.",
  },
  {
    icon: Workflow,
    title: "Move before the bottleneck hits",
    body:
      "Notified body capacity and audit slots will compress. Teams that prep now skip the panic queue in 2026.",
  },
] as const;

const features = [
  {
    icon: FileSearch,
    title: "Repo & docs scan",
    body:
      "Connect a GitHub repo or upload technical documentation. The agent maps your system to AI Act articles automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Gap analysis & evidence pack",
    body:
      "Get an executive summary, remediation roadmap and a structured evidence bundle ready for procurement and conformity prep.",
  },
  {
    icon: Workflow,
    title: "Watermarking & provenance setup",
    body:
      "Optional Art. 50 transparency setup for AI-generated content disclosure — when it actually applies.",
  },
] as const;

function Index() {
  return (
    <SiteLayout>
      <Hero />

      {/* Three buying motives */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Why teams buy now
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Three reasons compliance moved from "later" to "this quarter".
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {buyMotives.map((m) => (
            <div
              key={m.title}
              className="rounded-xl border border-border bg-surface-1 p-6 transition-colors hover:bg-surface-2"
            >
              <m.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-base font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What the agent does */}
      <section className="border-y border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                The agent
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Built like a tool — not a deck.
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                ActReady reads your code, dependencies and docs, then produces a structured AI Act
                readiness report mapped to specific articles and controls.
              </p>
              <Link
                to="/product"
                className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                See how it works →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border border-border bg-background p-5">
                  <f.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InvestorScore />

      <CTA />
    </SiteLayout>
  );
}
