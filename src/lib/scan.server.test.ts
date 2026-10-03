import { describe, it, expect } from "vitest";
import { parseGithubUrl } from "./scan.server";

describe("parseGithubUrl", () => {
  describe("valid GitHub URLs", () => {
    it("parses standard HTTPS GitHub repository URLs", () => {
      expect(parseGithubUrl("https://github.com/octocat/Hello-World")).toEqual({
        owner: "octocat",
        repo: "Hello-World",
      });
    });

    it("parses HTTP GitHub repository URLs", () => {
      expect(parseGithubUrl("http://github.com/facebook/react")).toEqual({
        owner: "facebook",
        repo: "react",
      });
    });

    it("strips trailing .git extension", () => {
      expect(parseGithubUrl("https://github.com/vercel/next.js.git")).toEqual({
        owner: "vercel",
        repo: "next.js",
      });
    });

    it("handles single and multiple trailing slashes", () => {
      expect(parseGithubUrl("https://github.com/tailwindlabs/tailwindcss/")).toEqual({
        owner: "tailwindlabs",
        repo: "tailwindcss",
      });

      expect(parseGithubUrl("https://github.com/tailwindlabs/tailwindcss///")).toEqual({
        owner: "tailwindlabs",
        repo: "tailwindcss",
      });
    });

    it("handles multiple leading slashes in path", () => {
      expect(parseGithubUrl("https://github.com///owner///repo///")).toEqual({
        owner: "owner",
        repo: "repo",
      });
    });

    it("extracts owner and repo when path contains deeper subroutes", () => {
      expect(parseGithubUrl("https://github.com/owner/repo/tree/main/src")).toEqual({
        owner: "owner",
        repo: "repo",
      });
      expect(parseGithubUrl("https://github.com/owner/repo/blob/main/README.md")).toEqual({
        owner: "owner",
        repo: "repo",
      });
    });
  });

  describe("invalid URLs and non-GitHub hosts", () => {
    it("returns null for non-GitHub domain URLs", () => {
      expect(parseGithubUrl("https://gitlab.com/owner/repo")).toBeNull();
      expect(parseGithubUrl("https://bitbucket.org/owner/repo")).toBeNull();
      expect(parseGithubUrl("https://example.com/owner/repo")).toBeNull();
    });

    it("returns null when hostname does not contain github.com", () => {
      expect(parseGithubUrl("https://google.com")).toBeNull();
    });

    it("returns null for malformed URLs", () => {
      expect(parseGithubUrl("not-a-valid-url")).toBeNull();
      expect(parseGithubUrl("://github.com/owner/repo")).toBeNull();
      expect(parseGithubUrl("")).toBeNull();
    });

    it("returns null when owner or repo is missing", () => {
      expect(parseGithubUrl("https://github.com")).toBeNull();
      expect(parseGithubUrl("https://github.com/")).toBeNull();
      expect(parseGithubUrl("https://github.com/owner")).toBeNull();
      expect(parseGithubUrl("https://github.com/owner/")).toBeNull();
      expect(parseGithubUrl("https://github.com//repo")).toBeNull();
    });
  });
});
