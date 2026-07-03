// Server-only helpers for the repo scan flow.
// Fetches public GitHub metadata and calls the Lovable AI Gateway for analysis.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";

export type RepoContext = {
  source: "github" | "upload";
  url?: string;
  repoFullName?: string;
  description?: string;
  topics?: string[];
  language?: string | null;
  readme?: string;
  fileTree?: string[];
  uploadedText?: string;
};

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("github.com")) return null;
    const [owner, repo] = u.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

export async function fetchRepoContext(repoUrl: string): Promise<RepoContext> {
  const parsed = parseGithubUrl(repoUrl);
  if (!parsed)
    throw new Error("Invalid GitHub URL. Use a public repo like https://github.com/owner/name");

  const { owner, repo } = parsed;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ActReady-Scanner",
  };

  const [metaRes, readmeRes, treeRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { ...headers, Accept: "application/vnd.github.raw" },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers }),
  ]);

  if (!metaRes.ok) {
    if (metaRes.status === 404) throw new Error("Repository not found or is private.");
    if (metaRes.status === 403) throw new Error("GitHub rate limit hit. Try again in a minute.");
    throw new Error(`GitHub API error (${metaRes.status}).`);
  }

  const meta = (await metaRes.json()) as {
    full_name: string;
    description: string | null;
    topics?: string[];
    language: string | null;
  };

  const readme = readmeRes.ok ? (await readmeRes.text()).slice(0, 12_000) : "";
  const tree = treeRes.ok
    ? ((await treeRes.json()) as Array<{ name: string; type: string }>).map(
        (e) => `${e.type === "dir" ? "📁 " : ""}${e.name}`,
      )
    : [];

  return {
    source: "github",
    url: repoUrl,
    repoFullName: meta.full_name,
    description: meta.description ?? undefined,
    topics: meta.topics ?? [],
    language: meta.language,
    readme,
    fileTree: tree.slice(0, 60),
  };
}

const SYSTEM_PROMPT = `You are an EU AI Act compliance auditor for software systems.
Given metadata, README and file tree of an AI / SaaS project (or pasted documentation), assess
EU AI Act readiness with a developer-first, anti-fluff tone.

Focus on:
- Likelihood the system is or interacts with a HIGH-RISK AI system (Annex III / III-related controls).
- Coverage of Art. 9 (Risk management), Art. 10 (Data governance), Art. 11 (Technical documentation),
  Art. 12 (Logging), Art. 13 (Transparency), Art. 14 (Human oversight), Art. 15 (Accuracy, robustness,
  cybersecurity), and Art. 50 transparency obligations (AI-generated content disclosure).
- Concrete missing artifacts: model cards, data sheets, eval reports, risk register, oversight playbook,
  incident logging, monitoring, conformity evidence.

Be honest. Do not invent compliance.`;

const TOOL = {
  type: "function" as const,
  function: {
    name: "submit_assessment",
    description: "Return a structured EU AI Act readiness assessment.",
    parameters: {
      type: "object",
      properties: {
        readiness_score: {
          type: "integer",
          minimum: 0,
          maximum: 100,
          description: "0-100 readiness for EU AI Act high-risk obligations.",
        },
        classification: {
          type: "string",
          enum: [
            "likely_high_risk",
            "possibly_high_risk",
            "limited_risk",
            "minimal_risk",
            "unclear",
          ],
        },
        executive_summary: {
          type: "string",
          description: "2-4 sentence summary for a CTO. Direct, no fluff.",
        },
        top_risks: {
          type: "array",
          minItems: 3,
          maxItems: 5,
          items: {
            type: "object",
            properties: {
              article: {
                type: "string",
                description: "EU AI Act article reference, e.g. 'Art. 9'.",
              },
              control: { type: "string" },
              status: { type: "string", enum: ["missing", "partial", "compliant"] },
              severity: { type: "string", enum: ["high", "medium", "low"] },
              finding: { type: "string", description: "What is missing or weak." },
              remediation: { type: "string", description: "Concrete next action." },
            },
            required: ["article", "control", "status", "severity", "finding", "remediation"],
            additionalProperties: false,
          },
        },
        next_steps: {
          type: "array",
          minItems: 3,
          maxItems: 6,
          items: { type: "string" },
        },
      },
      required: [
        "readiness_score",
        "classification",
        "executive_summary",
        "top_risks",
        "next_steps",
      ],
      additionalProperties: false,
    },
  },
};

export type Assessment = {
  readiness_score: number;
  classification:
    "likely_high_risk" | "possibly_high_risk" | "limited_risk" | "minimal_risk" | "unclear";
  executive_summary: string;
  top_risks: Array<{
    article: string;
    control: string;
    status: "missing" | "partial" | "compliant";
    severity: "high" | "medium" | "low";
    finding: string;
    remediation: string;
  }>;
  next_steps: string[];
};

export async function runAssessment(ctx: RepoContext): Promise<Assessment> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured.");

  const userContent =
    ctx.source === "github"
      ? `Repository: ${ctx.repoFullName}
URL: ${ctx.url}
Primary language: ${ctx.language ?? "unknown"}
Description: ${ctx.description ?? "(none)"}
Topics: ${(ctx.topics ?? []).join(", ") || "(none)"}

Top-level files:
${(ctx.fileTree ?? []).join("\n")}

README (truncated):
"""
${ctx.readme ?? "(no README)"}
"""`
      : `Pasted documentation:
"""
${ctx.uploadedText ?? ""}
"""`;

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      tools: [TOOL],
      tool_choice: { type: "function", function: { name: "submit_assessment" } },
    }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("AI rate limit hit. Try again in a minute.");
    if (res.status === 402) throw new Error("AI workspace credits exhausted. Top up to continue.");
    const t = await res.text();
    console.error("AI gateway error", res.status, t);
    throw new Error("AI gateway error.");
  }

  const data = await res.json();
  const call = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("AI returned no structured result.");
  return JSON.parse(call.function.arguments) as Assessment;
}
