import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "./auth-middleware";

vi.mock("@tanstack/react-start/server", () => ({
  getRequest: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

describe("requireSupabaseAuth middleware", () => {
  const originalEnv = process.env;
  const mockNext = vi.fn((args) => Promise.resolve({ ok: true, ...args }));

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "test-publishable-key";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const runMiddleware = async () => {
    const serverFn = (requireSupabaseAuth as unknown as { options: { server: (ctx: { next: typeof mockNext }) => Promise<unknown> } }).options.server;
    return serverFn({ next: mockNext });
  };

  describe("Environment variables validation", () => {
    it("throws 500 when SUPABASE_URL is missing", async () => {
      delete process.env.SUPABASE_URL;

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(500);
        const text = await res.text();
        expect(text).toContain("Missing Supabase environment variable(s): SUPABASE_URL");
      }
    });

    it("throws 500 when SUPABASE_PUBLISHABLE_KEY is missing", async () => {
      delete process.env.SUPABASE_PUBLISHABLE_KEY;

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(500);
        const text = await res.text();
        expect(text).toContain("Missing Supabase environment variable(s): SUPABASE_PUBLISHABLE_KEY");
      }
    });

    it("throws 500 when both SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are missing", async () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_PUBLISHABLE_KEY;

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(500);
        const text = await res.text();
        expect(text).toContain("Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY");
      }
    });
  });

  describe("Request and Authorization header validation", () => {
    it("throws 401 when request or request.headers is unavailable", async () => {
      vi.mocked(getRequest).mockReturnValue(undefined as unknown as Request);

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(401);
        const text = await res.text();
        expect(text).toBe("Unauthorized: No request headers available");
      }
    });

    it("throws 401 when authorization header is missing", async () => {
      vi.mocked(getRequest).mockReturnValue({
        headers: new Headers(),
      } as unknown as Request);

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(401);
        const text = await res.text();
        expect(text).toBe("Unauthorized: No authorization header provided");
      }
    });

    it("throws 401 when authorization header does not start with Bearer ", async () => {
      const headers = new Headers();
      headers.set("authorization", "Basic some-token");
      vi.mocked(getRequest).mockReturnValue({ headers } as unknown as Request);

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(401);
        const text = await res.text();
        expect(text).toBe("Unauthorized: Only Bearer tokens are supported");
      }
    });

    it("throws 401 when token is empty after removing Bearer prefix", async () => {
      const get = vi.fn().mockReturnValue("Bearer ");
      vi.mocked(getRequest).mockReturnValue({ headers: { get } } as unknown as Request);

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(401);
        const text = await res.text();
        expect(text).toBe("Unauthorized: No token provided");
      }
    });
  });

  describe("Supabase Token Verification", () => {
    it("throws 401 when getClaims returns an error or no claims", async () => {
      const headers = new Headers();
      headers.set("authorization", "Bearer invalid-token");
      vi.mocked(getRequest).mockReturnValue({ headers } as unknown as Request);

      const mockGetClaims = vi.fn().mockResolvedValue({
        data: null,
        error: new Error("Invalid token"),
      });

      vi.mocked(createClient).mockReturnValue({
        auth: {
          getClaims: mockGetClaims,
        },
      } as unknown as ReturnType<typeof createClient>);

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(401);
        const text = await res.text();
        expect(text).toBe("Unauthorized: Invalid token");
      }
    });

    it("throws 401 when claims do not contain sub (user ID)", async () => {
      const headers = new Headers();
      headers.set("authorization", "Bearer token-without-sub");
      vi.mocked(getRequest).mockReturnValue({ headers } as unknown as Request);

      const mockGetClaims = vi.fn().mockResolvedValue({
        data: { claims: { email: "user@example.com" } },
        error: null,
      });

      vi.mocked(createClient).mockReturnValue({
        auth: {
          getClaims: mockGetClaims,
        },
      } as unknown as ReturnType<typeof createClient>);

      try {
        await runMiddleware();
        expect.fail("Should have thrown a Response");
      } catch (error) {
        expect(error).toBeInstanceOf(Response);
        const res = error as Response;
        expect(res.status).toBe(401);
        const text = await res.text();
        expect(text).toBe("Unauthorized: No user ID found in token");
      }
    });
  });

  describe("Successful Authentication (Happy Path)", () => {
    it("successfully validates token and calls next with supabase context, userId, and claims", async () => {
      const token = "valid-jwt-token";
      const headers = new Headers();
      headers.set("authorization", `Bearer ${token}`);
      vi.mocked(getRequest).mockReturnValue({ headers } as unknown as Request);

      const claims = {
        sub: "user-uuid-1234",
        email: "test@example.com",
        role: "authenticated",
      };

      const mockGetClaims = vi.fn().mockResolvedValue({
        data: { claims },
        error: null,
      });

      const mockSupabaseClient = {
        auth: {
          getClaims: mockGetClaims,
        },
      };

      vi.mocked(createClient).mockReturnValue(mockSupabaseClient as unknown as ReturnType<typeof createClient>);

      const result = await runMiddleware();

      expect(createClient).toHaveBeenCalledWith(
        "https://example.supabase.co",
        "test-publishable-key",
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          auth: {
            storage: undefined,
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      );

      expect(mockGetClaims).toHaveBeenCalledWith(token);
      expect(mockNext).toHaveBeenCalledWith({
        context: {
          supabase: mockSupabaseClient,
          userId: "user-uuid-1234",
          claims,
        },
      });
      expect(result).toEqual({
        ok: true,
        context: {
          supabase: mockSupabaseClient,
          userId: "user-uuid-1234",
          claims,
        },
      });
    });
  });
});
