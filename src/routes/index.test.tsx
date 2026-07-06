import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Create a minimal version of the route component for testing
import { Route } from "./index";

// Mock tanstack router functionality since we only want to test our scene
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: { component: React.ComponentType }) => config.component,
}));

// Mock GSAP to prevent scroll trigger errors in testing env
vi.mock("gsap", () => {
  const gsapMock = {
    registerPlugin: vi.fn(),
    context: vi.fn((fn) => {
      fn();
      return { revert: vi.fn() };
    }),
    utils: {
      toArray: vi.fn(() => []),
      random: vi.fn(() => 100),
    },
    set: vi.fn(),
    to: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
    })),
  };
  return {
    default: gsapMock,
    ...gsapMock,
  };
});
vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    getAll: vi.fn(() => []),
  },
}));

const Index = Route;

describe("Motion Engine Index", () => {
  it("renders the 3D assets", () => {
    render(<Index />);
    expect(screen.getAllByText("OSX01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("GRIND").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TOXIC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("<WEB_DEV_SERVICES />").length).toBeGreaterThan(0);
  });

  it("toggles cyberpunk panel on web dev services click", () => {
    const { container } = render(<Index />);

    // Find the wrapper using role or specific text node
    const webDevText = screen.getAllByText("<WEB_DEV_SERVICES />")[0];
    const webDevAsset = webDevText.closest(".webdev-asset");
    expect(webDevAsset).not.toBeNull();

    // Panel should initially be hidden
    expect(screen.getAllByText("> WEB_DEV_SERVICES.EXE").length).toBeGreaterThan(0);

    // Find the main parent wrapper with the opacity toggle class
    const panelInnerWrapper = screen.getAllByText("> WEB_DEV_SERVICES.EXE")[0].closest("div");
    const panel = panelInnerWrapper?.closest(".absolute.top-1\\/2");

    expect(panel?.className).toContain("opacity-0");

    // Click to open
    if (webDevAsset) fireEvent.click(webDevAsset);

    // Panel should now be active
    expect(panel?.className).toContain("opacity-100");

    // Click close button
    const closeBtn = screen.getAllByText("[ RETURN_TO_CANVAS ]")[0];
    fireEvent.click(closeBtn);

    // Panel should be hidden again
    expect(panel?.className).toContain("opacity-0");
  });
});
