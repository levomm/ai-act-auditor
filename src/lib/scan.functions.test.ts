import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: (validator: (data: unknown) => unknown) => ({
      handler: (handlerFn: (args: { data: unknown }) => unknown) => {
        return (opts: { data: unknown }) => {
          const validated = validator(opts.data);
          return handlerFn({ data: validated });
        };
      },
    }),
  }),
}));

// Mocks
const mockSupabaseInsert = vi.fn().mockReturnThis();
const mockSupabaseSelect = vi.fn().mockReturnThis();
const mockSupabaseSingle = vi.fn().mockResolvedValue({ data: { id: "test-scan-id" }, error: null });

const mockSupabaseAdminUpdate = vi.fn().mockReturnThis();
const mockSupabaseAdminEq = vi.fn().mockResolvedValue({ data: null, error: null });
const mockSupabaseAdminInsert = vi.fn();

vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      from: vi.fn((table: string) => {
        if (table === "scans") {
          return {
            insert: mockSupabaseInsert,
            select: mockSupabaseSelect,
            single: mockSupabaseSingle,
          };
        }
        if (table === "leads") {
          return {
            insert: mockSupabaseInsert.mockResolvedValue({ data: null, error: null }),
          };
        }
        return {};
      }),
    },
  };
});

vi.mock("@/integrations/supabase/client.server", () => {
  return {
    supabaseAdmin: {
      from: vi.fn((table: string) => {
        if (table === "scans") {
          return {
            insert: mockSupabaseAdminInsert,
            update: mockSupabaseAdminUpdate,
            eq: mockSupabaseAdminEq,
          };
        }
        if (table === "leads") {
          return {
            insert: mockSupabaseAdminInsert,
          };
        }
        return {};
      }),
    },
  };
});

vi.mock("./scan.server", () => ({
  fetchRepoContext: vi.fn().mockResolvedValue({ source: "github", readme: "test" }),
  runAssessment: vi.fn().mockResolvedValue({
    readiness_score: 85,
    classification: "minimal_risk",
    executive_summary: "Looks good.",
    top_risks: [],
    next_steps: [],
  }),
}));

import { runScan } from "./scan.functions";
import { submitLead } from "./leads.functions";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

describe("scan and leads security fixes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseInsert.mockReturnThis();
    mockSupabaseSelect.mockReturnThis();
    mockSupabaseSingle.mockResolvedValue({ data: { id: "test-scan-id" }, error: null });
    mockSupabaseAdminUpdate.mockReturnThis();
    mockSupabaseAdminEq.mockResolvedValue({ data: null, error: null });
  });

  it("runScan uses standard public supabase client for inserts (enforcing RLS)", async () => {
    const res = await (runScan as unknown as (args: { data: unknown }) => Promise<unknown>)({
      data: {
        email: "user@example.com",
        repoUrl: "https://github.com/owner/repo",
      },
    });

    expect(res).toEqual({ scanId: "test-scan-id" });

    // Verify public supabase client was used for inserting into scans and leads
    expect(supabase.from).toHaveBeenCalledWith("scans");
    expect(supabase.from).toHaveBeenCalledWith("leads");
    expect(mockSupabaseInsert).toHaveBeenCalledWith({
      email: "user@example.com",
      repo_url: "https://github.com/owner/repo",
      status: "running",
    });
    expect(mockSupabaseInsert).toHaveBeenCalledWith({
      email: "user@example.com",
      source: "scan",
      scan_id: "test-scan-id",
    });

    // Verify service role supabaseAdmin was NOT used for inserting
    expect(mockSupabaseAdminInsert).not.toHaveBeenCalled();

    // Verify service role supabaseAdmin was used ONLY for updating scans assessment
    expect(supabaseAdmin.from).toHaveBeenCalledWith("scans");
    expect(mockSupabaseAdminUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "complete",
        score: 85,
        classification: "minimal_risk",
      }),
    );
  });

  it("submitLead uses standard public supabase client for inserts (enforcing RLS)", async () => {
    mockSupabaseInsert.mockResolvedValueOnce({ data: null, error: null });

    const res = await (submitLead as unknown as (args: { data: unknown }) => Promise<unknown>)({
      data: {
        email: "lead@example.com",
        source: "waitlist",
      },
    });

    expect(res).toEqual({ ok: true });

    // Verify public supabase client was used for inserting lead
    expect(supabase.from).toHaveBeenCalledWith("leads");
    expect(mockSupabaseInsert).toHaveBeenCalledWith({
      email: "lead@example.com",
      source: "waitlist",
      company: null,
      employees: null,
      ai_use_case: null,
      notes: null,
    });

    // Verify service role supabaseAdmin was NOT used
    expect(mockSupabaseAdminInsert).not.toHaveBeenCalled();
  });
});
