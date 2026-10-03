import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { ChartStyle, ChartConfig } from "./chart";

describe("ChartStyle component", () => {
  it("renders valid CSS variables for theme and color config", () => {
    const config: ChartConfig = {
      desktop: {
        label: "Desktop",
        color: "#2563eb",
      },
      mobile: {
        label: "Mobile",
        theme: {
          light: "#60a5fa",
          dark: "#1e40af",
        },
      },
    };

    const { container } = render(<ChartStyle id="test-chart" config={config} />);
    const styleTag = container.querySelector("style");

    expect(styleTag).not.toBeNull();
    expect(styleTag?.innerHTML).toContain("[data-chart=test-chart]");
    expect(styleTag?.innerHTML).toContain("--color-desktop: #2563eb;");
    expect(styleTag?.innerHTML).toContain("--color-mobile: #60a5fa;");
    expect(styleTag?.innerHTML).toContain(".dark [data-chart=test-chart]");
    expect(styleTag?.innerHTML).toContain("--color-mobile: #1e40af;");
  });

  it("sanitizes dangerous XSS payload and CSS injection characters in id, key, and color", () => {
    const config: ChartConfig = {
      'desktop"><script>alert(1)</script>': {
        label: "Desktop",
        color: 'red;</style><script>alert("xss")</script>',
      },
      "mobile}; body { display: none; }": {
        label: "Mobile",
        theme: {
          light: "blue; }",
          dark: "green; }",
        },
      },
    };

    const { container } = render(
      <ChartStyle id='test-chart"><script>alert("id-xss")</script>' config={config} />,
    );
    const styleTag = container.querySelector("style");

    expect(styleTag).not.toBeNull();
    const styleContent = styleTag?.innerHTML || "";

    // Should not contain raw script tags, unescaped brackets, quotes, or semicolons in injected values
    expect(styleContent).not.toContain("<script>");
    expect(styleContent).not.toContain("</style>");
    expect(styleContent).not.toContain('alert("xss")');

    // Verified sanitized outputs
    expect(styleContent).toContain("[data-chart=test-chartscriptalert(id-xss)/script]");
    expect(styleContent).toContain(
      "--color-desktopscriptalert(1)/script: red/stylescriptalert(xss)/script;",
    );
    expect(styleContent).toContain("--color-mobile body  display: none : blue ;");
  });
});
