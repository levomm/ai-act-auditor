import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { runScan } from "@/lib/scan.functions";
import { GitBranch, FileText, Loader2 } from "lucide-react";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Free 5-minute EU AI Act repo scan — ActReady" },
      {
        name: "description",
        content:
          "Paste a public GitHub repo or your AI system docs. Get a readiness score, your top 3 gaps and a remediation snapshot. No signup beyond email.",
      },
      { property: "og:title", content: "Free EU AI Act readiness scan" },
      {
        property: "og:description",
        content:
          "Repo in, audit insights out. The fastest way to know where your AI system stands against the EU AI Act.",
      },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  const navigate = useNavigate();
  const scan = useServerFn(runScan);
  const [mode, setMode] = useState<"repo" | "docs">("repo");
  const [email, setEmail] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <SiteLayout>
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 md:py-20">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Free scan
          </div>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Run a free readiness scan
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Public repo or architecture summary only. Do not submit sensitive internal material
            through the free form — private systems go through the guided audit flow.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-border bg-surface-1 p-6 md:p-8">
          <div className="grid grid-cols-2 gap-1 rounded-md bg-surface-2 p-1">
            <button
              type="button"
              onClick={() => setMode("repo")}
              className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                mode === "repo" ? "bg-background text-foreground" : "text-muted-foreground"
              }`}
            >
              <GitBranch className="h-4 w-4" /> GitHub repo
            </button>
            <button
              type="button"
              onClick={() => setMode("docs")}
              className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                mode === "docs" ? "bg-background text-foreground" : "text-muted-foreground"
              }`}
            >
              <FileText className="h-4 w-4" /> Paste docs
            </button>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                const result = await scan({
                  data: {
                    email,
                    repoUrl: mode === "repo" ? repoUrl : undefined,
                    pastedText: mode === "docs" ? pastedText : undefined,
                  },
                });
                navigate({ to: "/scan/result/$scanId", params: { scanId: result.scanId } });
              } catch (err) {
                setError(err instanceof Error ? err.message : "Scan failed.");
                setLoading(false);
              }
            }}
          >
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Work email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cto@yourcompany.com"
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </label>

            {mode === "repo" ? (
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Public GitHub repo URL</span>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <span className="mt-1 block text-xs text-muted-foreground">
                  We read the README, file tree and metadata. Nothing is cloned or stored beyond the report.
                </span>
              </label>
            ) : (
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                  Paste documentation (model card, architecture doc, system description)
                </span>
                <textarea
                  required
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  rows={10}
                  placeholder="Paste up to ~20k characters describing your AI system."
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>
            )}

            {error && <div className="text-sm text-destructive">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Reviewing your inputs and mapping
                  likely evidence gaps…
                </>
              ) : (
                "Generate readiness report"
              )}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              By submitting you agree to receive your report by email. No spam — single email per scan.
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
