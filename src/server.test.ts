import { describe, expect, it } from "vitest";
import { isCatastrophicSsrErrorBody } from "./server";

describe("isCatastrophicSsrErrorBody", () => {
  describe("parameterized edge cases and payloads", () => {
    it.each([
      // [description, body, responseStatus, expectedResult]
      ["returns false for invalid JSON string", "not json", 500, false],
      ["returns false for empty string", "", 500, false],
      ["returns false for null JSON payload", "null", 500, false],
      ["returns false for primitive JSON number", "123", 500, false],
      ["returns false for primitive JSON boolean", "true", 500, false],
      ["returns false for primitive JSON string", '"HTTPError"', 500, false],
      ["returns false for JSON array", "[]", 500, false],
      ["returns false for empty JSON object", "{}", 500, false],
      [
        "returns false when unexpected keys are present",
        JSON.stringify({ unhandled: true, message: "HTTPError", extraKey: "value" }),
        500,
        false,
      ],
      [
        "returns false when message is not HTTPError",
        JSON.stringify({ unhandled: true, message: "OtherError" }),
        500,
        false,
      ],
      [
        "returns false when unhandled is false",
        JSON.stringify({ unhandled: false, message: "HTTPError" }),
        500,
        false,
      ],
      [
        "returns false when unhandled is truthy but not a boolean",
        JSON.stringify({ unhandled: 1, message: "HTTPError" }),
        500,
        false,
      ],
      [
        "returns false when status key exists but does not match responseStatus",
        JSON.stringify({ unhandled: true, message: "HTTPError", status: 502 }),
        500,
        false,
      ],
      [
        "returns true when unhandled is true, message is HTTPError, and status is omitted",
        JSON.stringify({ unhandled: true, message: "HTTPError" }),
        500,
        true,
      ],
      [
        "returns true when unhandled is true, message is HTTPError, and status matches responseStatus",
        JSON.stringify({ unhandled: true, message: "HTTPError", status: 500 }),
        500,
        true,
      ],
      [
        "returns true for custom 5xx status matching responseStatus",
        JSON.stringify({ unhandled: true, message: "HTTPError", status: 503 }),
        503,
        true,
      ],
    ])("%s", (_description, body, responseStatus, expectedResult) => {
      expect(isCatastrophicSsrErrorBody(body, responseStatus)).toBe(expectedResult);
    });
  });
});
