import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CTA } from "@/components/site/CTA";
import { GitBranch, Brain, FileCheck2, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Product — How ActReady audits your AI system" },
      {
        name: "description",
        content:
          "ActReady scans repos, docs and workflows, classifies high-risk exposure, and produces an audit-ready evidence package mapped to EU AI Act articles.",
      },
      { property: "og:title", content: "How ActReady works" },
      {
        property: "og:description",
        content:
          "Repo scan → gap analysis → remediation roadmap → evidence package. Designed for engineering teams, not legal departments.",
      },
    ],
  }),
  component: ProductPage,
});

const steps = [
  {
    icon: GitBranch,
    title: "1. Connect your code & docs",
    body: "Paste a GitHub repo URL or upload technical documentation. The agent ingests structure, dependencies, READMEs, model cards and policies.",
  },
  {
    icon: Brain,
    title: "2. Classify high-risk exposure",
    body: "We map your use case against Annex III categories and adjacent product-regulated zones, with a clear classification and confidence note.",
  },
  {
    icon: ClipboardList,
    title: "3. Map controls to articles",
    body: "Every gap is anchored to specific EU AI Act articles — Art. 9, 10, 11, 12, 13, 14, 15 — with status, severity and a concrete fix.",
  },
  {
    icon: FileCheck2,
    title: "4. Generate audit-ready evidence",
    body: "Executive summary, remediation roadmap, policy templates and a structured evidence package you can ship to procurement or counsel.",
  },
] as const;

function ProductPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Product
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              An EU AI Act audit agent that reads your code.
            </h1>
            <p className="mt-5 text-base text-muted-foreground md:text-lg">
              Compliance teams write policies. Procurement asks for evidence. Engineering ships
              features. ActReady is the layer that ties them together — built developer-first, with
              the same rigor your team expects from observability or security tooling.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-surface-1 p-6">
              <s.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">What the report contains</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Every scan produces the same structured artefacts. The DFY audit adds manual review,
                workshop and a policy pack on top.
              </p>
            </div>
            <ul className="space-y-4 text-sm">
              {[
                "Readiness score (0–100) and high-risk classification",
                "Executive summary written for a CTO, not a lawyer",
                "Gap matrix mapped to AI Act articles with status & severity",
                "Concrete remediation actions with owner-ready language",
                "Evidence checklist: technical docs, logging, oversight, monitoring",
                "Optional Art. 50 transparency / watermarking setup notes",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTA
        title="Run the agent on your repo."
        sub="Free, takes about a minute. You'll get a readiness score and your top 3 gaps before any sales call."
      />
    </SiteLayout>
  );
}
