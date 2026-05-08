const rows = [
  ["Speed to cash", 9],
  ["Ease of execution", 8],
  ["Margin", 9],
  ["Scalability", 9],
  ["Moat potential", 8],
] as const;

export function InvestorScore() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="rounded-xl border border-border bg-surface-1 p-6 md:p-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          Investor view
        </div>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            {rows.map(([label, score]) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-44 text-sm text-muted-foreground">{label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(score / 10) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-sm">{score}/10</span>
              </div>
            ))}
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Skeptic
              </div>
              <p className="mt-2 text-foreground">
                "Regulation shifts, but demand for auditability, evidence, and procurement-readiness is
                already here."
              </p>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Verdict
              </div>
              <p className="mt-2 text-base font-semibold text-primary">Strong buy.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
