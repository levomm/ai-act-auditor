import { describe, it, expect } from "vitest";
import { renderErrorPage } from "./error-page";

describe("renderErrorPage", () => {
  it("returns a valid HTML string starting with <!doctype html>", () => {
    const html = renderErrorPage();
    expect(html.trim().startsWith("<!doctype html>")).toBe(true);
  });

  it("contains key error page content and action elements", () => {
    const html = renderErrorPage();

    // Check title and main header
    expect(html).toContain("<title>This page didn't load</title>");
    expect(html).toContain("<h1>This page didn't load</h1>");

    // Check description message
    expect(html).toContain(
      "Something went wrong on our end. You can try refreshing or head back home.",
    );

    // Check action controls: refresh button and home link
    expect(html).toContain('onclick="location.reload()"');
    expect(html).toContain("Try again");
    expect(html).toContain('href="/"');
    expect(html).toContain("Go home");
  });
});
