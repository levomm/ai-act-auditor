import { describe, it, expect } from "vitest";
import { range } from "./utils";

describe("range utility", () => {
  it("returns an array of numbers from 0 up to length - 1", () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it("returns an empty array when length is 0", () => {
    expect(range(0)).toEqual([]);
  });

  it("handles length of 1", () => {
    expect(range(1)).toEqual([0]);
  });
});
