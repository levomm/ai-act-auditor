import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/scan/result/$scanId")({
  head: () => ({
    meta: [
      { title: "Scan result — ActReady" },
      { name: "description", content: "Your EU AI Act readiness scan result." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ScanResult,
});

type ScanRow = {
  id: string;
  status: string;
  score: number | null;
  classification: string | null;
  top_risks: TopRisk[] | null;
  full_report: FullReport | null;
  error: string | null;
  repo_url: string | null;
  created_at: string;
};

type TopRisk = {
  article: string;
  control: string;
  status: "missing" | "partial" | "compliant";
  severity: "high" | "medium" | "low";
  finding: string;
  remediation: string;
};

type FullReport = {
  executive_summary?: string;
  next_steps?: string[];
};

const classificationLabel: Record<string, string> = {
  likely_high_risk: "Likely high-risk",
  possibly_high_risk: "Possibly high-risk",
  limited_risk: "Limited risk",
  minimal_risk: "Minimal risk",
  unclear: "Unclear — manual review needed",
};

function ScanResult() {
  const { scanId } = useParams({ from: "/scan/result/$scanId" });

  const { data: row = null, error } = useQuery({
    queryKey: ["scan", scanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .eq("id", scanId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }
      return data as unknown as ScanRow | null;
    },
    enabled: Boolean(scanId),
    refetchInterval: (query) => {
      const data = query.state.data;

      // Stop polling if fetch threw an error or status is terminal (complete / error)
      if (
        query.state.status === "error" ||
        (data && (data.status === "complete" || data.status === "error"))
      ) {
        return false;
      }

      // Exponential backoff strategy:
      // Starts at 2500ms, increases by 1.5x on each update attempt, capped at 15000ms.
      const updateCount = query.state.dataUpdateCount;
      const initialInterval = 2500;
      const maxInterval = 15000;
      return Math.min(initialInterval * Math.pow(1.5, updateCount), maxInterval);
    },
  });

  const err = error instanceof Error ? error.message : error ? String(error) : null;

  if (err) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-2xl font-semibold">Couldn't load that scan</h1>
          <p className="mt-2 text-sm text-muted-foreground">{err}</p>
        </div>
      </SiteLayout>
    );
  }

  if (!row || row.status === "running" || row.status === "pending") {
    return (
      <SiteLayout>
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h1 className="mt-6 text-2xl font-semibold">Scanning your system…</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We're reading your repo and mapping it to AI Act articles. This usually takes 30–60
            seconds.
          </p>
        </div>
      </SiteLayout>
    );
  }

  if (row.status === "error") {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-2xl font-semibold">Scan failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">{row.error}</p>
          <Link
            to="/scan"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const score = row.score ?? 0;
  const risks = row.top_risks ?? [];
  const summary = row.full_report?.executive_summary;
  const nextSteps = row.full_report?.next_steps ?? [];
  const cls = row.classification
    ? (classificationLabel[row.classification] ?? row.classification)
    : "—";

  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Readiness report
          </div>
          {row.repo_url && (
            <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {row.repo_url}
            </div>
          )}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface-1 p-6 md:col-span-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Score</div>
              <div className="mt-2 flex items-baseline gap-3 font-mono">
                <span className="text-6xl font-semibold tracking-tight">{score}</span>
                <span className="text-2xl text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div
                  className={`h-full ${score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-destructive"}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              {summary && <p className="mt-5 text-sm text-foreground">{summary}</p>}
            </div>
            <div className="rounded-xl border border-border bg-surface-1 p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Classification
              </div>
              <div className="mt-2 text-lg font-semibold">{cls}</div>
              <Link
                to="/audit"
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Book DFY audit
              </Link>
              <Link
                to="/pricing"
                className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-surface-2"
              >
                See SaaS plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Top compliance gaps</h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Article</th>
                <th className="px-4 py-3 text-left">Control</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">Remediation</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i} className="border-t border-border bg-surface-1 align-top">
                  <td className="px-4 py-3 font-mono text-xs">{r.article}</td>
                  <td className="px-4 py-3">{r.control}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <SeverityPill sev={r.severity} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.remediation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {nextSteps.length > 0 && (
          <div className="mt-10 rounded-xl border border-border bg-surface-1 p-6">
            <h3 className="text-base font-semibold">Recommended next steps</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {nextSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 rounded-xl border border-primary/30 bg-surface-2 p-6">
          <h3 className="text-base font-semibold">This is the agent's first pass.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            For a defensible audit package — manual review, workshop, policy pack and audit-prep
            dossier — book a DFY engagement. Typical turnaround: 10 working days.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/audit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Book DFY audit
            </Link>
            <Link
              to="/scan"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-surface-2"
            >
              Run another scan
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function StatusPill({ status }: { status: TopRisk["status"] }) {
  const styles: Record<TopRisk["status"], string> = {
    missing: "border-destructive/40 bg-destructive/10 text-destructive",
    partial: "border-warning/40 bg-warning/10 text-warning",
    compliant: "border-success/40 bg-success/10 text-success",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function SeverityPill({ sev }: { sev: TopRisk["severity"] }) {
  const styles: Record<TopRisk["severity"], string> = {
    high: "border-destructive/40 text-destructive",
    medium: "border-warning/40 text-warning",
    low: "border-success/40 text-success",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${styles[sev]}`}
    >
      {sev}
    </span>
  );
}
