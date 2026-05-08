import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { CTA } from "@/components/site/CTA";
import { InvestorScore } from "@/components/site/InvestorScore";
import {
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  Workflow,
  Gauge,
  ListChecks,
  FileText,
  ScrollText,
  Map,
  FolderTree,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ActReady — EU AI Act readiness for teams shipping AI into Europe" },
      {
        name: "description",
        content:
          "ActReady scans your repo, technical docs, and AI workflows to assess EU AI Act readiness, surface evidence gaps, and generate a remediation plan for engineering and compliance teams.",
      },
      { property: "og:title", content: "ActReady — EU AI Act readiness, developer-first" },
      {
        property: "og:description",
        content:
          "See what procurement, auditors, and enterprise buyers will ask for before they ask for it.",
      },
    ],
  }),
  component: Index,
});

const valueProps = [
  {
    icon: AlertTriangle,
    title: "Classify likely exposure",
    body:
      "Get a practical first-pass view of whether your system looks low-risk, transparency-triggered, or high-risk-adjacent based on its purpose, workflows, and outputs.",
  },
  {
    icon: FileSearch,
    title: "Find evidence gaps",
    body:
      "See what is missing across documentation, logging, oversight, risk controls, vendor records, and operational ownership.",
  },
  {
    icon: Workflow,
    title: "Generate a remediation plan",
    body:
      "Turn a vague compliance problem into a concrete engineering and governance to-do list with priority levels and next actions.",
  },
] as const;

const steps = [
  {
    title: "Scan your inputs",
    body:
      "Start with a public repo, architecture summary, or technical documentation set. The system reviews code signals, product context, workflows, and stated use cases.",
  },
  {
    title: "Map readiness signals",
    body:
      "ActReady identifies likely obligations, evidence gaps, and control weaknesses across documentation, traceability, oversight, transparency, and operational governance.",
  },
  {
    title: "Get the output pack",
    body:
      "Receive a readiness report, executive summary, missing-evidence checklist, and remediation roadmap your team can use internally or take into a deeper audit.",
  },
] as const;

const outputs = [
  {
    icon: Gauge,
    title: "Readiness score",
    body: "A fast snapshot of your current AI governance and evidence maturity.",
  },
  {
    icon: ShieldCheck,
    title: "Likely risk and obligation view",
    body:
      "A structured view of which AI Act obligations may apply based on your system role, use case, and deployment model.",
  },
  {
    icon: ListChecks,
    title: "Evidence gap analysis",
    body:
      "A list of what is missing across policy, docs, logs, workflows, testing, vendor controls, and ownership.",
  },
  {
    icon: FileText,
    title: "Executive summary",
    body: "A short report leadership can read without translating engineering speak.",
  },
  {
    icon: Map,
    title: "Remediation roadmap",
    body:
      "A prioritized plan showing what to fix first, what can wait, and what needs human review.",
  },
  {
    icon: FolderTree,
    title: "Evidence package structure",
    body:
      "A clean folder and checklist structure for preparing procurement responses, internal reviews, and formal audit prep.",
  },
] as const;

const evidenceBullets = [
  "Scope and intended purpose",
  "Risk and control register",
  "Technical documentation",
  "Logging and traceability notes",
  "Human oversight workflows",
  "Transparency and disclosure copy",
  "Testing and monitoring artifacts",
  "Vendor and supply chain records",
  "Operational ownership checklist",
] as const;

const audiences = [
  {
    title: "AI vendors selling into Europe",
    body:
      "You need clearer answers before enterprise buyers, legal, or partner due diligence starts asking harder questions.",
  },
  {
    title: "Product and engineering teams",
    body:
      "You need a practical way to map system behavior, documentation, and controls without turning the team into a policy factory.",
  },
  {
    title: "Compliance and governance leads",
    body:
      "You need a faster way to see what exists, what is missing, and where human review is actually required.",
  },
] as const;

const faqs = [
  {
    q: "Does this make us compliant?",
    a: "No. It helps you assess readiness, identify likely obligations, find missing controls, and assemble the evidence needed for deeper review and audit preparation.",
  },
  {
    q: "Can we connect a private repo?",
    a: "Private systems go through a guided audit or secure onboarding flow. The free scan is best for public repos or structured architecture summaries.",
  },
  {
    q: "Who is this for?",
    a: "Teams building or deploying AI systems that need a practical view of readiness before procurement, legal, partner diligence, or internal governance pressure escalates.",
  },
  {
    q: "What do we get after the scan?",
    a: "You get a readiness score, likely obligation view, evidence gap analysis, and a remediation roadmap with clear next steps.",
  },
  {
    q: "Is this legal advice?",
    a: "No. It is a technical readiness and evidence-mapping product for engineering, product, and compliance workflows.",
  },
] as const;

const quotes = [
  {
    label: "For engineering",
    text: "Finally, a compliance workflow that starts from the system, not a blank policy document.",
  },
  {
    label: "For leadership",
    text: "Know what is missing before a buyer or auditor does.",
  },
  {
    label: "For compliance",
    text: "Turn scattered artifacts into a usable evidence trail.",
  },
] as const;

function Index() {
  return (
    <SiteLayout>
      <Hero />

      {/* Problem */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          The problem
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Why teams get stuck
        </h2>
        <div className="mt-6 space-y-4 text-base text-muted-foreground">
          <p>
            Most teams do not fail because they wrote zero policy. They fail because their evidence
            is scattered across repos, docs, tickets, vendors, and tribal knowledge.
          </p>
          <p>
            Procurement, legal, and enterprise buyers do not want a vibe. They want a clear picture
            of system scope, risk exposure, logging, oversight, transparency, vendor dependencies,
            and who owns what.
          </p>
          <p className="text-foreground">
            ActReady turns technical artifacts into a readiness view your team can actually use.
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-y border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {valueProps.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-border bg-background p-6 transition-colors hover:bg-surface-2"
              >
                <v.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            How it works
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            From inputs to an evidence trail.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-border bg-surface-1 p-6">
              <div className="font-mono text-xs text-primary">Step {i + 1}</div>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer block */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="rounded-xl border border-border bg-surface-2 p-6 md:p-8">
          <h2 className="text-lg font-semibold">What this is — and what it is not</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            ActReady is a readiness and evidence-mapping tool for product, engineering, and
            compliance teams. It helps you assess likely obligations, find missing controls, and
            prepare audit-ready materials. It does not replace formal legal review, conformity
            assessment, or regulator guidance.
          </p>
        </div>
      </section>

      {/* Outputs */}
      <section id="outputs" className="border-y border-border bg-surface-1 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Outputs
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              What you get
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {outputs.map((o) => (
              <div key={o.title} className="rounded-xl border border-border bg-background p-6">
                <o.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence pack */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr]">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Evidence pack
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Built around evidence, not slide decks.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Good compliance work is boring on purpose. Buyers and auditors want logs, documentation,
              ownership, testing records, transparency text, vendor information, and proof that
              controls exist outside somebody's head.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              ActReady helps teams assemble a repeatable evidence stack instead of scrambling every
              time procurement sends another questionnaire.
            </p>
          </div>
          <ul className="grid gap-2 self-start rounded-xl border border-border bg-surface-1 p-6">
            {evidenceBullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who it is for */}
      <section className="border-y border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Who it's for
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Who this is for
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-xl border border-border bg-background p-6">
                <h3 className="text-base font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-border bg-background p-6 md:p-8">
            <h3 className="text-lg font-semibold">Not for</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              This is not for companies looking for a magic "make us compliant" button. It is also
              not for teams that want to skip internal ownership, documentation discipline, or legal
              review and pretend a scan solved the problem.
            </p>
          </div>
        </div>
      </section>

      {/* DFY teaser */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 rounded-xl border border-border bg-surface-1 p-6 md:grid-cols-[2fr_1fr] md:p-10">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Done-for-you
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Need more than a scan
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              When the free scan surfaces real gaps, move into a DFY audit. We work through your
              system scope, controls, documentation, evidence sources, and remediation priorities
              with your team.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "Guided system review",
                "Evidence pack setup",
                "Missing-documents plan",
                "Remediation workshop",
                "Procurement and audit prep support",
              ].map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-end">
            <Link
              to="/audit"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Book DFY audit
            </Link>
          </div>
        </div>
      </section>

      {/* Watermarking / transparency */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="rounded-xl border border-border bg-surface-2 p-6 md:p-8">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Transparency
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Transparency controls where they actually apply
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            If your product generates AI content, ActReady can flag where disclosure and provenance
            controls may matter and help your team structure a practical implementation path. It is
            one control layer, not the whole compliance story.
          </p>
        </div>
      </section>

      {/* Social proof / positioning */}
      <section className="border-y border-border bg-surface-1">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Positioning
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Built like a tool, not a deck.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              For teams that want operational clarity, not performative compliance language. The
              output is structured so engineering, product, legal, and leadership can all work from
              the same reality.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {quotes.map((q) => (
              <div key={q.label} className="rounded-xl border border-border bg-background p-6">
                <div className="text-xs font-medium uppercase tracking-widest text-primary">
                  {q.label}
                </div>
                <p className="mt-3 text-sm">"{q.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InvestorScore />

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 scroll-mt-20">
        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          FAQ
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Frequently asked
        </h2>
        <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-surface-1">
          {faqs.map((f) => (
            <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CTA />
    </SiteLayout>
  );
}
