import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock tanstack router functionality
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: { component: React.ComponentType }) => config.component,
  useParams: () => ({ scanId: "test-scan-123" }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock Supabase client using vi.hoisted
const { mockMaybeSingle, mockEq, mockSelect, mockFrom } = vi.hoisted(() => {
  const mockMaybeSingle = vi.fn();
  const mockEq = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  return { mockMaybeSingle, mockEq, mockSelect, mockFrom };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: mockFrom,
  },
}));

// Import the component after mocks
import { Route } from "./scan.result.$scanId";

const ScanResult = Route;

function renderWithClient(ui: React.ReactElement, client: QueryClient) {
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("ScanResult Polling", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMaybeSingle.mockReset();
    mockEq.mockClear();
    mockSelect.mockClear();
    mockFrom.mockClear();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
  });

  it("renders loading state when scan is running", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { id: "test-scan-123", status: "running" },
      error: null,
    });

    renderWithClient(<ScanResult />, queryClient);

    await waitFor(() => {
      expect(screen.getByText("Scanning your system…")).toBeTruthy();
    });
  });

  it("renders completed scan result and displays details", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: "test-scan-123",
        status: "complete",
        score: 85,
        classification: "limited_risk",
        top_risks: [
          {
            article: "Art 10",
            control: "Data Governance",
            status: "compliant",
            severity: "low",
            finding: "Good",
            remediation: "None needed",
          },
        ],
        full_report: { executive_summary: "System is overall compliant." },
        error: null,
        repo_url: "https://github.com/example/repo",
        created_at: new Date().toISOString(),
      },
      error: null,
    });

    renderWithClient(<ScanResult />, queryClient);

    await waitFor(() => {
      expect(screen.getByText("85")).toBeTruthy();
      expect(screen.getByText("Limited risk")).toBeTruthy();
      expect(screen.getByText("System is overall compliant.")).toBeTruthy();
    });
  });

  it("stops polling when status becomes complete", async () => {
    mockMaybeSingle
      .mockResolvedValueOnce({
        data: { id: "test-scan-123", status: "running" },
        error: null,
      })
      .mockResolvedValueOnce({
        data: {
          id: "test-scan-123",
          status: "complete",
          score: 90,
          classification: "minimal_risk",
          top_risks: [],
          full_report: {},
          error: null,
          repo_url: null,
          created_at: new Date().toISOString(),
        },
        error: null,
      });

    vi.useFakeTimers();

    renderWithClient(<ScanResult />, queryClient);

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockMaybeSingle).toHaveBeenCalledTimes(1);

    // Advance fake timers by 4000ms to trigger 2nd poll
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
      await Promise.resolve();
    });

    expect(mockMaybeSingle).toHaveBeenCalledTimes(2);

    // Advance time by another 10 seconds - no more calls should happen because status is complete
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
      await Promise.resolve();
    });

    expect(mockMaybeSingle).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("measures polling interval and request count over a 30 second window", async () => {
    vi.useFakeTimers();

    mockMaybeSingle.mockResolvedValue({
      data: { id: "test-scan-123", status: "running" },
      error: null,
    });

    renderWithClient(<ScanResult />, queryClient);

    await act(async () => {
      await Promise.resolve();
    });

    const initialCalls = mockMaybeSingle.mock.calls.length;

    // Advance 30 seconds asynchronously with fake timers
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30000);
    });

    const callsIn30s = mockMaybeSingle.mock.calls.length - initialCalls;
    console.log(
      `[Benchmark] Calls made during 30s running scan with exponential backoff: ${callsIn30s}`,
    );
    // Exponential backoff produces 3 calls in 30s instead of 12 calls
    expect(callsIn30s).toBeLessThan(12);

    vi.useRealTimers();
  });
});
