import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge simple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes and falsy values", () => {
    expect(cn("base", true && "active", false && "disabled", null, undefined, 0)).toBe("base active");
  });

  it("should support object inputs for toggling classes", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("should support array inputs", () => {
    expect(cn(["btn", "btn-primary"], ["shadow", false && "rounded"])).toBe("btn btn-primary shadow");
  });

  it("should correctly resolve Tailwind CSS class conflicts using tailwind-merge", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("should return empty string when no valid classes are provided", () => {
    expect(cn()).toBe("");
    expect(cn(null, undefined, false)).toBe("");
  });
});
