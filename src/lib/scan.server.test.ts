import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchRepoContext, runAssessment, type RepoContext } from "./scan.server";

describe("scan.server", () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = originalEnv;
  });

  describe("fetchRepoContext", () => {
    it("throws error for invalid GitHub URL", async () => {
      await expect(fetchRepoContext("not-a-url")).rejects.toThrow(
        "Invalid GitHub URL. Use a public repo like https://github.com/owner/name",
      );
      await expect(fetchRepoContext("https://gitlab.com/owner/repo")).rejects.toThrow(
        "Invalid GitHub URL. Use a public repo like https://github.com/owner/name",
      );
      await expect(fetchRepoContext("https://github.com/owner")).rejects.toThrow(
        "Invalid GitHub URL. Use a public repo like https://github.com/owner/name",
      );
    });

    it("throws specific error when repository is not found (404)", async () => {
      globalThis.fetch = vi.fn().mockImplementation((url: string) => {
        if (
          url.includes("/repos/owner/repo") &&
          !url.includes("/readme") &&
          !url.includes("/contents")
        ) {
          return Promise.resolve(new Response(null, { status: 404 }));
        }
        return Promise.resolve(new Response(null, { status: 404 }));
      });

      await expect(fetchRepoContext("https://github.com/owner/repo")).rejects.toThrow(
        "Repository not found or is private.",
      );
    });

    it("throws specific error when rate limit is hit (403)", async () => {
      globalThis.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve(new Response(null, { status: 403 }));
      });

      await expect(fetchRepoContext("https://github.com/owner/repo")).rejects.toThrow(
        "GitHub rate limit hit. Try again in a minute.",
      );
    });

    it("throws general error for other GitHub API failures (e.g. 500)", async () => {
      globalThis.fetch = vi.fn().mockImplementation(() => {
        return Promise.resolve(new Response(null, { status: 500 }));
      });

      await expect(fetchRepoContext("https://github.com/owner/repo")).rejects.toThrow(
        "GitHub API error (500).",
      );
    });

    it("handles success when meta, readme, and file tree are all retrieved", async () => {
      const mockMeta = {
        full_name: "owner/repo",
        description: "A test repo",
        topics: ["ai", "compliance"],
        language: "TypeScript",
      };

      const mockReadme = "# Test Repository\nThis is a test README.";

      const mockTree = [
        { name: "src", type: "dir" },
        { name: "README.md", type: "file" },
      ];

      globalThis.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.endsWith("/readme")) {
          return Promise.resolve(new Response(mockReadme, { status: 200 }));
        }
        if (url.endsWith("/contents")) {
          return Promise.resolve(
            new Response(JSON.stringify(mockTree), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
        return Promise.resolve(
          new Response(JSON.stringify(mockMeta), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      });

      const result = await fetchRepoContext("https://github.com/owner/repo.git");

      expect(result).toEqual({
        source: "github",
        url: "https://github.com/owner/repo.git",
        repoFullName: "owner/repo",
        description: "A test repo",
        topics: ["ai", "compliance"],
        language: "TypeScript",
        readme: mockReadme,
        fileTree: ["📁 src", "README.md"],
      });
    });

    it("gracefully falls back when optional readme and tree endpoints return non-200 responses", async () => {
      const mockMeta = {
        full_name: "owner/repo",
        description: null,
        language: null,
      };

      globalThis.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.endsWith("/readme") || url.endsWith("/contents")) {
          return Promise.resolve(new Response(null, { status: 404 }));
        }
        return Promise.resolve(
          new Response(JSON.stringify(mockMeta), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      });

      const result = await fetchRepoContext("https://github.com/owner/repo");

      expect(result).toEqual({
        source: "github",
        url: "https://github.com/owner/repo",
        repoFullName: "owner/repo",
        description: undefined,
        topics: [],
        language: null,
        readme: "",
        fileTree: [],
      });
    });
  });

  describe("runAssessment", () => {
    const validAssessment = {
      readiness_score: 85,
      classification: "limited_risk",
      executive_summary: "System shows strong readiness for EU AI Act compliance.",
      top_risks: [
        {
          article: "Art. 9",
          control: "Risk Management",
          status: "partial",
          severity: "medium",
          finding: "Risk assessment is incomplete.",
          remediation: "Document formal risk assessment process.",
        },
      ],
      next_steps: ["Step 1", "Step 2", "Step 3"],
    };

    it("throws error when LOVABLE_API_KEY is not configured", async () => {
      delete process.env.LOVABLE_API_KEY;

      const mockCtx: RepoContext = { source: "github", repoFullName: "owner/repo" };
      await expect(runAssessment(mockCtx)).rejects.toThrow("LOVABLE_API_KEY not configured.");
    });

    it("throws error when AI gateway returns 429 rate limit", async () => {
      process.env.LOVABLE_API_KEY = "test-api-key";

      globalThis.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 429 }));

      const mockCtx: RepoContext = { source: "github", repoFullName: "owner/repo" };
      await expect(runAssessment(mockCtx)).rejects.toThrow(
        "AI rate limit hit. Try again in a minute.",
      );
    });

    it("throws error when AI gateway returns 402 payment required", async () => {
      process.env.LOVABLE_API_KEY = "test-api-key";

      globalThis.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 402 }));

      const mockCtx: RepoContext = { source: "github", repoFullName: "owner/repo" };
      await expect(runAssessment(mockCtx)).rejects.toThrow(
        "AI workspace credits exhausted. Top up to continue.",
      );
    });

    it("throws generic error when AI gateway returns 500 error", async () => {
      process.env.LOVABLE_API_KEY = "test-api-key";
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      globalThis.fetch = vi
        .fn()
        .mockResolvedValue(new Response("Internal Server Error", { status: 500 }));

      const mockCtx: RepoContext = { source: "github", repoFullName: "owner/repo" };
      await expect(runAssessment(mockCtx)).rejects.toThrow("AI gateway error.");
      expect(consoleSpy).toHaveBeenCalledWith("AI gateway error", 500, "Internal Server Error");
    });

    it("throws error when AI gateway response lacks structured function call arguments", async () => {
      process.env.LOVABLE_API_KEY = "test-api-key";

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ choices: [{ message: {} }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

      const mockCtx: RepoContext = { source: "github", repoFullName: "owner/repo" };
      await expect(runAssessment(mockCtx)).rejects.toThrow("AI returned no structured result.");
    });

    it("successfully runs assessment for github source", async () => {
      process.env.LOVABLE_API_KEY = "test-api-key";

      const mockAiResponse = {
        choices: [
          {
            message: {
              tool_calls: [
                {
                  function: {
                    name: "submit_assessment",
                    arguments: JSON.stringify(validAssessment),
                  },
                },
              ],
            },
          },
        ],
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockAiResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

      const mockCtx: RepoContext = {
        source: "github",
        url: "https://github.com/owner/repo",
        repoFullName: "owner/repo",
        language: "TypeScript",
        description: "Test repo",
        topics: ["ai"],
        fileTree: ["src/index.ts"],
        readme: "# Test",
      };

      const assessment = await runAssessment(mockCtx);
      expect(assessment).toEqual(validAssessment);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer test-api-key",
            "Content-Type": "application/json",
          },
        }),
      );
    });

    it("successfully runs assessment for upload source", async () => {
      process.env.LOVABLE_API_KEY = "test-api-key";

      const mockAiResponse = {
        choices: [
          {
            message: {
              tool_calls: [
                {
                  function: {
                    arguments: JSON.stringify(validAssessment),
                  },
                },
              ],
            },
          },
        ],
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockAiResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

      const mockCtx: RepoContext = {
        source: "upload",
        uploadedText: "System documentation text",
      };

      const assessment = await runAssessment(mockCtx);
      expect(assessment).toEqual(validAssessment);
    });
  });
});
