import { describe, it, expect } from "vitest";
import { scanInputSchema } from "./scan.functions";

describe("scanInputSchema validation", () => {
  describe("valid inputs", () => {
    it("accepts valid email with repoUrl", () => {
      const input = {
        email: "test@example.com",
        repoUrl: "https://github.com/example/repo",
      };

      const result = scanInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          email: "test@example.com",
          repoUrl: "https://github.com/example/repo",
        });
      }
    });

    it("accepts valid email with pastedText > 50 characters", () => {
      const pastedText = "A".repeat(51);
      const input = {
        email: "user@domain.co",
        pastedText,
      };

      const result = scanInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@domain.co");
        expect(result.data.pastedText).toBe(pastedText);
      }
    });

    it("accepts valid email with both repoUrl and pastedText", () => {
      const input = {
        email: "auditor@ai-act.eu",
        repoUrl: "https://github.com/company/ai-service",
        pastedText: "Documentation text that is long enough to pass validation rules.",
      };

      const result = scanInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("trims whitespace from string fields", () => {
      const input = {
        email: "  spaced@example.com  ",
        repoUrl: "  https://github.com/example/repo  ",
        pastedText: "  " + "B".repeat(51) + "  ",
      };

      const result = scanInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("spaced@example.com");
        expect(result.data.repoUrl).toBe("https://github.com/example/repo");
        expect(result.data.pastedText).toBe("B".repeat(51));
      }
    });
  });

  describe("invalid inputs", () => {
    it("rejects invalid email formats", () => {
      const invalidEmails = ["not-an-email", "user@", "@domain.com", "user.domain.com"];

      for (const email of invalidEmails) {
        const result = scanInputSchema.safeParse({
          email,
          repoUrl: "https://github.com/owner/repo",
        });
        expect(result.success).toBe(false);
      }
    });

    it("rejects email exceeding 255 characters", () => {
      const longEmail = "a".repeat(250) + "@domain.com";
      const result = scanInputSchema.safeParse({
        email: longEmail,
        repoUrl: "https://github.com/owner/repo",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid repoUrl formats", () => {
      const invalidUrls = ["not-a-url", "github.com/missing-protocol", "http://", "://invalid"];

      for (const repoUrl of invalidUrls) {
        const result = scanInputSchema.safeParse({
          email: "valid@example.com",
          repoUrl,
        });
        expect(result.success, `Expected ${repoUrl} to fail validation`).toBe(false);
      }
    });

    it("rejects repoUrl exceeding 500 characters", () => {
      const longUrl = "https://github.com/owner/" + "a".repeat(500);
      const result = scanInputSchema.safeParse({
        email: "valid@example.com",
        repoUrl: longUrl,
      });
      expect(result.success).toBe(false);
    });

    it("rejects pastedText exceeding 20,000 characters", () => {
      const longText = "a".repeat(20_001);
      const result = scanInputSchema.safeParse({
        email: "valid@example.com",
        pastedText: longText,
      });
      expect(result.success).toBe(false);
    });

    it("rejects when neither repoUrl nor pastedText is provided", () => {
      const result = scanInputSchema.safeParse({
        email: "valid@example.com",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Provide a GitHub URL or paste at least 50 characters of documentation."
        );
      }
    });

    it("rejects when pastedText is 50 characters or fewer and no repoUrl is provided", () => {
      const text50Chars = "a".repeat(50);
      const result = scanInputSchema.safeParse({
        email: "valid@example.com",
        pastedText: text50Chars,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Provide a GitHub URL or paste at least 50 characters of documentation."
        );
      }
    });
  });
});
