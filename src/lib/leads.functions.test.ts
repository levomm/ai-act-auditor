import { describe, it, expect, vi, beforeEach } from "vitest";

const mockInsert = vi.fn();
const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    from: (table: string) => mockFrom(table),
  },
}));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let validatorFn: ((d: unknown) => unknown) | undefined;
    const builder = {
      inputValidator: (validator: (d: unknown) => unknown) => {
        validatorFn = validator;
        return builder;
      },
      handler: (handlerFn: (ctx: { data: any }) => Promise<any>) => {
        return async (args: { data: any }) => {
          const validatedData = validatorFn ? validatorFn(args.data) : args.data;
          return handlerFn({ data: validatedData });
        };
      },
    };
    return builder;
  },
}));

import { leadSchema, submitLead } from "./leads.functions";

describe("leads.functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  describe("leadSchema", () => {
    it("validates a minimal valid payload", () => {
      const input = {
        email: "user@example.com",
        source: "contact",
      };
      const result = leadSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          email: "user@example.com",
          source: "contact",
        });
      }
    });

    it("validates a full payload with all optional fields", () => {
      const input = {
        email: "  john@company.com  ",
        source: "dfy_booking",
        company: "  Acme Corp  ",
        employees: "  50-100  ",
        ai_use_case: "  Automated compliance checking  ",
        notes: "  Looking forward to discussing.  ",
      };
      const result = leadSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          email: "john@company.com",
          source: "dfy_booking",
          company: "Acme Corp",
          employees: "50-100",
          ai_use_case: "Automated compliance checking",
          notes: "Looking forward to discussing.",
        });
      }
    });

    it("accepts all allowed source enum values", () => {
      const sources = ["dfy_booking", "waitlist", "contact"] as const;
      for (const source of sources) {
        const result = leadSchema.safeParse({
          email: "test@example.com",
          source,
        });
        expect(result.success).toBe(true);
      }
    });

    it("rejects invalid email formats", () => {
      const invalidEmails = ["notanemail", "user@", "@domain.com", "user@domain"];
      for (const email of invalidEmails) {
        const result = leadSchema.safeParse({
          email,
          source: "contact",
        });
        expect(result.success).toBe(false);
      }
    });

    it("rejects invalid source values", () => {
      const result = leadSchema.safeParse({
        email: "user@example.com",
        source: "invalid_source",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing required fields", () => {
      expect(leadSchema.safeParse({ source: "contact" }).success).toBe(false);
      expect(leadSchema.safeParse({ email: "user@example.com" }).success).toBe(false);
    });

    it("enforces field length limits", () => {
      const longEmail = `${"a".repeat(248)}@test.com`; // 257 chars
      expect(
        leadSchema.safeParse({
          email: longEmail,
          source: "contact",
        }).success
      ).toBe(false);

      expect(
        leadSchema.safeParse({
          email: "user@example.com",
          source: "contact",
          company: "a".repeat(201),
        }).success
      ).toBe(false);

      expect(
        leadSchema.safeParse({
          email: "user@example.com",
          source: "contact",
          employees: "a".repeat(51),
        }).success
      ).toBe(false);

      expect(
        leadSchema.safeParse({
          email: "user@example.com",
          source: "contact",
          ai_use_case: "a".repeat(2001),
        }).success
      ).toBe(false);

      expect(
        leadSchema.safeParse({
          email: "user@example.com",
          source: "contact",
          notes: "a".repeat(2001),
        }).success
      ).toBe(false);
    });
  });

  describe("submitLead", () => {
    it("successfully inserts a lead into Supabase", async () => {
      mockInsert.mockResolvedValueOnce({ error: null });

      const payload = {
        email: "lead@example.com",
        source: "waitlist" as const,
        company: "Tech Corp",
      };

      const res = await submitLead({ data: payload });

      expect(mockFrom).toHaveBeenCalledWith("leads");
      expect(mockInsert).toHaveBeenCalledWith({
        email: "lead@example.com",
        source: "waitlist",
        company: "Tech Corp",
        employees: null,
        ai_use_case: null,
        notes: null,
      });
      expect(res).toEqual({ ok: true });
    });

    it("throws an error when Supabase insertion fails", async () => {
      mockInsert.mockResolvedValueOnce({
        error: { message: "Unique constraint violation" },
      });

      const payload = {
        email: "lead@example.com",
        source: "contact" as const,
      };

      await expect(submitLead({ data: payload })).rejects.toThrow("Unique constraint violation");
    });
  });
});
