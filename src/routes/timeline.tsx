import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CTA } from "@/components/site/CTA";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "EU AI Act timeline — when obligations actually hit" },
      {
        name: "description",
        content:
          "High-risk AI Act obligations apply from 2 August 2026. Annex I product-regulated systems extend into 2027. The market is buying audit-readiness now.",
      },
      { property: "og:title", content: "EU AI Act enforcement timeline" },
      {
        property: "og:description",
        content:
          "Prepare now, not when legal panics. Concrete dates and what to do before each.",
      },
    ],
  }),
  component: TimelinePage,
});

const events = [
  {
    date: "2 February 2025",
    title: "Prohibited AI practices in force",
    body: "Bans on certain manipulative, exploitative and social-scoring use cases. If you ship anything close to these zones, you should already have stopped.",
  },
  {
    date: "2 August 2025",
    title: "GPAI model rules apply",
    body: "Obligations for general-purpose AI model providers (transparency, training data summaries, copyright policy) are live.",
  },
  {
    date: "2 August 2026",
    title: "High-risk AI obligations apply",
    body:
      "The big one. Risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy & robustness — all enforceable for high-risk systems.",
    highlight: true,
  },
  {
    date: "2 August 2027",
    title: "Annex I product-regulated systems",
    body: "Extended deadline for high-risk AI embedded in regulated products (medical devices, machinery, etc.). Don't read this as 'we have time' — your enterprise buyers won't.",
  },
] as const;

function TimelinePage() {
  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Timeline
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Prepare now — not when legal panics.
            </h1>
            <p className="mt-5 text-base text-muted-foreground md:text-lg">
              The EU AI Act's high-risk obligations apply from <span className="text-foreground">2 August 2026</span>.
              Annex I product-regulated systems get an extra year. But enterprise procurement and
              notified-body capacity tell a different story: the market is buying audit-readiness
              right now.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <ol className="relative space-y-6 border-l border-border pl-8">
          {events.map((e) => (
            <li key={e.date} className="relative">
              <span
                className={`absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 ${
                  e.highlight ? "border-primary bg-primary" : "border-border bg-background"
                }`}
              />
              <div
                className={`rounded-xl border p-5 ${
                  e.highlight
                    ? "border-primary/40 bg-surface-2"
                    : "border-border bg-surface-1"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-semibold">{e.title}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{e.date}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <CTA
        title="Where does your system stand?"
        sub="Run the free repo scan. Get a readiness score and the three gaps you should fix before the next procurement cycle."
      />
    </SiteLayout>
  );
}
