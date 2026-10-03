import { describe, expect, it } from "vitest";
import { cn, range } from "./utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
  });
});

describe("range utility", () => {
  it("returns an array of sequential integers from 0 to length - 1", () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it("returns an empty array when length is 0", () => {
    expect(range(0)).toEqual([]);
  });

  it("returns an empty array when length is negative", () => {
    expect(range(-5)).toEqual([]);
  });

  it("handles length of 1", () => {
    expect(range(1)).toEqual([0]);
  });
});
