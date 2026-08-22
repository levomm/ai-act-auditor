import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartStyle, ChartConfig } from "./chart";

describe("ChartStyle", () => {
  it("renders valid chart config styles correctly", () => {
    const config: ChartConfig = {
      desktop: { label: "Desktop", color: "#2563eb" },
      mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
    };

    const { container } = render(<ChartStyle id="test-chart" config={config} />);
    const styleElement = container.querySelector("style");

    expect(styleElement).not.toBeNull();
    const content = styleElement?.innerHTML || "";
    expect(content).toContain("[data-chart=test-chart]");
    expect(content).toContain("--color-desktop: #2563eb;");
    expect(content).toContain("--color-mobile: hsl(var(--chart-2));");
  });

  it("renders light and dark theme configurations", () => {
    const config: ChartConfig = {
      desktop: {
        label: "Desktop",
        theme: {
          light: "#2563eb",
          dark: "#60a5fa",
        },
      },
    };

    const { container } = render(<ChartStyle id="themed-chart" config={config} />);
    const styleElement = container.querySelector("style");

    expect(styleElement).not.toBeNull();
    const content = styleElement?.innerHTML || "";
    expect(content).toContain("[data-chart=themed-chart]");
    expect(content).toContain("--color-desktop: #2563eb;");
    expect(content).toContain(".dark [data-chart=themed-chart]");
    expect(content).toContain("--color-desktop: #60a5fa;");
  });

  it("sanitizes malicious script injection vectors in id, key, and color", () => {
    const config: ChartConfig = {
      "desktop<script>alert(1)</script>": {
        label: "Desktop",
        color: "red;</style><script>alert('xss')</script>",
      },
    };

    const maliciousId = "chart-id'\"</style><script>alert(1)</script>";
    const { container } = render(<ChartStyle id={maliciousId} config={config} />);
    const styleElement = container.querySelector("style");

    expect(styleElement).not.toBeNull();
    const content = styleElement?.innerHTML || "";

    // Verify script tags, quotes, braces, semicolons, and angle brackets are neutralized
    expect(content).not.toContain("<script>");
    expect(content).not.toContain("</style>");
    expect(content).not.toContain("<");
    expect(content).not.toContain(">");
    expect(content).not.toContain("'");
    expect(content).not.toContain('"');
    expect(content).toContain("[data-chart=chart-idstylescriptalert1script]");
    expect(content).toContain(
      "--color-desktopscriptalert1script: red/stylescriptalert(xss)/script;",
    );
  });

  it("returns null when no colors or themes are provided in config", () => {
    const config: ChartConfig = {
      desktop: { label: "Desktop" },
    };

    const { container } = render(<ChartStyle id="empty-chart" config={config} />);
    expect(container.querySelector("style")).toBeNull();
  });
});
