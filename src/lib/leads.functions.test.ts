import { describe, it, expect, vi } from "vitest";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: (validator: (data: unknown) => unknown) => ({
      handler: (handler: (args: { data: unknown }) => unknown) => {
        return async (args: { data: unknown }) => {
          const validatedData = validator ? validator(args.data) : args.data;
          return handler({ ...args, data: validatedData });
        };
      },
    }),
  }),
}));

vi.mock("@/integrations/supabase/client", () => {
  const insertMock = vi.fn().mockResolvedValue({ error: null });
  const fromMock = vi.fn().mockReturnValue({ insert: insertMock });
  return {
    supabase: {
      from: fromMock,
      _insertMock: insertMock,
    },
  };
});

import { submitLead } from "./leads.functions";
import { supabase } from "@/integrations/supabase/client";

describe("submitLead function", () => {
  it("uses the standard supabase client to insert leads", async () => {
    const testData = {
      email: "test@example.com",
      source: "contact" as const,
      company: "Acme Corp",
    };

    const submitFn = submitLead as unknown as (args: { data: typeof testData }) => Promise<unknown>;
    const result = await submitFn({ data: testData });

    expect(result).toEqual({ ok: true });
    expect(supabase.from).toHaveBeenCalledWith("leads");
    const supabaseWithMock = supabase as unknown as { _insertMock: ReturnType<typeof vi.fn> };
    expect(supabaseWithMock._insertMock).toHaveBeenCalledWith({
      email: "test@example.com",
      source: "contact",
      company: "Acme Corp",
      employees: null,
      ai_use_case: null,
      notes: null,
    });
  });
});
