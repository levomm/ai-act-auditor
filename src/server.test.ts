import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before importing server module
vi.mock("@tanstack/react-start/server-entry", () => ({
  default: {
    fetch: vi.fn(),
  },
}));

vi.mock("./lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("./lib/error-capture", () => ({
  consumeLastCapturedError: vi.fn(),
}));

import server from "./server";
import serverEntry from "@tanstack/react-start/server-entry";
import { logger } from "./lib/logger";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

describe("server.ts fetch handler and catastrophic SSR error normalizer", () => {
  const mockFetch = serverEntry.fetch as unknown as ReturnType<typeof vi.fn>;
  const mockConsumeError = consumeLastCapturedError as unknown as ReturnType<typeof vi.fn>;
  const mockLoggerError = logger.error as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const dummyRequest = new Request("http://localhost/");
  const dummyEnv = {};
  const dummyCtx = {};

  it("passes through successful responses (status < 500) unchanged", async () => {
    const okResponse = new Response("OK", { status: 200, headers: { "content-type": "text/plain" } });
    mockFetch.mockResolvedValueOnce(okResponse);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).toBe(okResponse);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("OK");
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("passes through 4xx error responses unchanged", async () => {
    const notFoundResponse = new Response("Not Found", {
      status: 404,
      headers: { "content-type": "application/json" },
    });
    mockFetch.mockResolvedValueOnce(notFoundResponse);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).toBe(notFoundResponse);
    expect(response.status).toBe(404);
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("passes through 500 non-JSON responses unchanged", async () => {
    const htmlErrorResponse = new Response("<h1>Server Error</h1>", {
      status: 500,
      headers: { "content-type": "text/html" },
    });
    mockFetch.mockResolvedValueOnce(htmlErrorResponse);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).toBe(htmlErrorResponse);
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("passes through 500 JSON responses with missing content-type header unchanged", async () => {
    const noContentTypeResponse = new Response(JSON.stringify({ unhandled: true, message: "HTTPError" }), {
      status: 500,
    });
    mockFetch.mockResolvedValueOnce(noContentTypeResponse);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).toBe(noContentTypeResponse);
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("passes through 500 JSON responses with invalid JSON body unchanged", async () => {
    const invalidJsonResponse = new Response("not-a-json-string", {
      status: 500,
      headers: { "content-type": "application/json" },
    });
    mockFetch.mockResolvedValueOnce(invalidJsonResponse);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).toBe(invalidJsonResponse);
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("passes through 500 JSON responses with non-object JSON body unchanged", async () => {
    const arrayJsonResponse = new Response(JSON.stringify(["unhandled", "HTTPError"]), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
    mockFetch.mockResolvedValueOnce(arrayJsonResponse);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).toBe(arrayJsonResponse);
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("passes through 500 JSON responses with extra unexpected keys unchanged", async () => {
    const extraKeysResponse = new Response(
      JSON.stringify({ unhandled: true, message: "HTTPError", extra: "unexpected" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
    mockFetch.mockResolvedValueOnce(extraKeysResponse);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).toBe(extraKeysResponse);
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("passes through 500 JSON responses when unhandled is not true or message is not HTTPError", async () => {
    const nonCatastrophicResponse1 = new Response(
      JSON.stringify({ unhandled: false, message: "HTTPError" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
    mockFetch.mockResolvedValueOnce(nonCatastrophicResponse1);

    let response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);
    expect(response).toBe(nonCatastrophicResponse1);

    const nonCatastrophicResponse2 = new Response(
      JSON.stringify({ unhandled: true, message: "OtherError" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
    mockFetch.mockResolvedValueOnce(nonCatastrophicResponse2);

    response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);
    expect(response).toBe(nonCatastrophicResponse2);
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("passes through 500 JSON responses when status field exists but does not match response.status", async () => {
    const mismatchedStatusResponse = new Response(
      JSON.stringify({ unhandled: true, message: "HTTPError", status: 502 }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
    mockFetch.mockResolvedValueOnce(mismatchedStatusResponse);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).toBe(mismatchedStatusResponse);
    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it("normalizes catastrophic SSR error payload and logs captured error if present", async () => {
    const catastrophicPayload = JSON.stringify({ unhandled: true, message: "HTTPError" });
    const catastrophicResponse = new Response(catastrophicPayload, {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
    mockFetch.mockResolvedValueOnce(catastrophicResponse);

    const capturedError = new Error("Original SSR throw");
    mockConsumeError.mockReturnValueOnce(capturedError);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response).not.toBe(catastrophicResponse);
    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await response.text()).toBe(renderErrorPage());
    expect(mockConsumeError).toHaveBeenCalledTimes(1);
    expect(mockLoggerError).toHaveBeenCalledWith(capturedError);
  });

  it("normalizes catastrophic SSR error payload with matching status field and logs fallback error when no captured error exists", async () => {
    const catastrophicPayload = JSON.stringify({ unhandled: true, message: "HTTPError", status: 500 });
    const catastrophicResponse = new Response(catastrophicPayload, {
      status: 500,
      headers: { "content-type": "application/json" },
    });
    mockFetch.mockResolvedValueOnce(catastrophicResponse);

    mockConsumeError.mockReturnValueOnce(undefined);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await response.text()).toBe(renderErrorPage());
    expect(mockLoggerError).toHaveBeenCalledTimes(1);
    const loggedError = mockLoggerError.mock.calls[0][0];
    expect(loggedError).toBeInstanceOf(Error);
    expect((loggedError as Error).message).toBe(`h3 swallowed SSR error: ${catastrophicPayload}`);
  });

  it("catches unhandled exceptions thrown by handler.fetch and returns branded error response", async () => {
    const thrownError = new Error("Unhandled handler crash");
    mockFetch.mockRejectedValueOnce(thrownError);

    const response = await server.fetch(dummyRequest, dummyEnv, dummyCtx);

    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await response.text()).toBe(renderErrorPage());
    expect(mockLoggerError).toHaveBeenCalledWith(thrownError);
  });
});
